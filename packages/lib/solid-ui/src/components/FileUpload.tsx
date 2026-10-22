/**
 * FileUpload — composite uploader: a Dropzone plus a validated, removable file
 * list with size/type/count rejection chips and a total-size summary.
 */
import { createSignal, For, Show } from "solid-js";
import { Dropzone } from "./Dropzone";

export type FileRejectReason = "size" | "type" | "count";

export interface FileUploadProps {
	/** Accepted types — comma-separated mime prefixes ("image/*") or extensions (".png,.pdf"). */
	accept?: string;
	multiple?: boolean;
	/** Maximum per-file size in bytes. */
	maxSize?: number;
	/** Maximum total number of files. */
	maxFiles?: number;
	/** Called with the full accepted list on every change. */
	onFiles?: (files: File[]) => void;
	/** Called for each rejected file with the reason. */
	onReject?: (file: File, reason: FileRejectReason) => void;
	/** Extra classes for the file list. */
	listClass?: string;
	/** Disable the dropzone and list actions. */
	disabled?: boolean;
	class?: string;
}

const formatBytes = (bytes: number) => {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${bytes} B`;
};

const matchesAccept = (file: File, accept?: string) => {
	if (!accept) return true;
	const name = file.name.toLowerCase();
	const type = (file.type || "").toLowerCase();
	return accept
		.split(",")
		.map((a) => a.trim().toLowerCase())
		.filter(Boolean)
		.some((a) =>
			a.endsWith("/*") ? type.startsWith(a.slice(0, -1)) : a.startsWith(".") ? name.endsWith(a) : type === a,
		);
};

export function FileUpload(props: FileUploadProps) {
	const [files, setFiles] = createSignal<File[]>([]);
	const [rejected, setRejected] = createSignal<{ file: File; reason: FileRejectReason }[]>([]);

	const validate = (incoming: File[]) => {
		const accepted = [...files()];
		const bad: { file: File; reason: FileRejectReason }[] = [];
		for (const f of incoming) {
			if (!matchesAccept(f, props.accept)) bad.push({ file: f, reason: "type" });
			else if (props.maxSize !== undefined && f.size > props.maxSize) bad.push({ file: f, reason: "size" });
			else if (!props.multiple && accepted.length >= 1) bad.push({ file: f, reason: "count" });
			else if (props.maxFiles !== undefined && accepted.length >= props.maxFiles)
				bad.push({ file: f, reason: "count" });
			else accepted.push(f);
		}
		setRejected(bad);
		setFiles(accepted);
		props.onFiles?.(accepted);
		for (const r of bad) props.onReject?.(r.file, r.reason);
	};

	const removeAt = (index: number) => {
		const next = files().filter((_, i) => i !== index);
		setFiles(next);
		props.onFiles?.(next);
	};

	const clearAll = () => {
		setFiles([]);
		setRejected([]);
		props.onFiles?.([]);
	};

	const totalSize = () => files().reduce((sum, f) => sum + f.size, 0);

	const reasonLabel: Record<FileRejectReason, string> = {
		size: "too large",
		type: "wrong type",
		count: "too many files",
	};

	return (
		<div class={`solidui-file-upload flex w-full flex-col gap-2 ${props.class ?? ""}`}>
			<Dropzone accept={props.accept} multiple={props.multiple} disabled={props.disabled} onFiles={validate} />
			<Show when={rejected().length > 0}>
				<div role="alert" class="flex flex-wrap gap-1.5" aria-label="Rejected files">
					<For each={rejected()}>
						{(r) => (
							<span class="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-2xs text-destructive">
								{r.file.name} — {reasonLabel[r.reason]}
							</span>
						)}
					</For>
				</div>
			</Show>
			<Show when={files().length > 0}>
				<ul class={`flex flex-col gap-1 ${props.listClass ?? ""}`} aria-label="Selected files">
					<For each={files()}>
						{(file, index) => (
							<li class="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground">
								<span class="break-all">{file.name}</span>
								<span class="ml-auto shrink-0 tabular-nums text-muted-foreground">{formatBytes(file.size)}</span>
								<button
									type="button"
									disabled={props.disabled}
									aria-label={`Remove ${file.name}`}
									class="shrink-0 rounded p-0.5 text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
									onClick={() => removeAt(index())}
								>
									<svg
										class="h-3 w-3"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</button>
							</li>
						)}
					</For>
				</ul>
				<div class="flex items-center justify-between text-xs text-muted-foreground">
					<span>
						{files().length} file{files().length === 1 ? "" : "s"} · {formatBytes(totalSize())}
					</span>
					<button
						type="button"
						disabled={props.disabled}
						onClick={clearAll}
						class="font-medium text-muted-foreground motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					>
						Clear all
					</button>
				</div>
			</Show>
		</div>
	);
}
