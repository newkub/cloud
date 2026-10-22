/**
 * Dropzone — drag-and-drop file area with browse fallback, validation and a file list.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

const formatBytes = (bytes: number) => {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${bytes} B`;
};

export interface DropzoneProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onDrop" | "onChange"> {
	/** File types accepted, e.g. "image/*" or ".png,.jpg". */
	accept?: string;
	multiple?: boolean;
	disabled?: boolean;
	/** Maximum allowed file size in bytes — larger files are rejected. */
	maxSize?: number;
	/** Maximum number of accepted files. */
	maxFiles?: number;
	/** Called with the accepted files (dropped or picked). */
	onFiles?: (files: File[]) => void;
	/** Called with the files rejected by `maxSize`/`maxFiles`. */
	onReject?: (files: File[]) => void;
	/** Show the accepted files as a removable list under the drop area. @default false */
	showFiles?: boolean;
	/** Show a clear-all button once files are accepted — implies `showFiles`. @default false */
	clearable?: boolean;
	/** Heading text. @default "Drop files here" */
	title?: string;
	/** Hint text under the title. */
	hint?: string;
	/** Hide the browse button label. */
	hideBrowse?: boolean;
	/** Error state — `true` flags the area invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const pad = { sm: "p-4", md: "p-8", lg: "p-12" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function Dropzone(props: DropzoneProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"accept",
		"multiple",
		"disabled",
		"maxSize",
		"maxFiles",
		"onFiles",
		"onReject",
		"showFiles",
		"clearable",
		"title",
		"hint",
		"hideBrowse",
		"error",
		"variant",
		"size",
		"radius",
		"fullWidth",
	]);
	const [dragging, setDragging] = createSignal(false);
	const [files, setFiles] = createSignal<File[]>([]);
	const [rejected, setRejected] = createSignal<File[]>([]);
	let inputRef: HTMLInputElement | undefined;

	const emit = (list: FileList | null) => {
		const picked = list ? [...list] : [];
		if (!picked.length) return;
		let accepted = local.maxSize !== undefined ? picked.filter((f) => f.size <= (local.maxSize ?? 0)) : picked;
		const rejectedFiles = picked.filter((f) => !accepted.includes(f));
		if (local.maxFiles !== undefined) {
			const room = Math.max(0, local.maxFiles - files().length);
			rejectedFiles.push(...accepted.slice(room));
			accepted = accepted.slice(0, room);
		}
		setRejected(rejectedFiles);
		if (accepted.length) {
			const next = local.multiple ? [...files(), ...accepted] : accepted;
			setFiles(next);
			local.onFiles?.(accepted);
		}
		if (rejectedFiles.length) local.onReject?.(rejectedFiles);
	};

	const removeAt = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const clearAll = () => {
		setFiles([]);
		setRejected([]);
	};

	const invalid = () => (local.error !== undefined && local.error !== false) || rejected().length > 0;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const listVisible = () => (local.showFiles || local.clearable) && files().length > 0;

	return (
		<div class={local.fullWidth ? "w-full" : "inline-block"}>
			{/* biome-ignore lint/a11y/useSemanticElements: dropzone wraps a hidden file input — a real <button> cannot contain interactive children */}
			<div
				role="button"
				tabIndex={local.disabled ? -1 : 0}
				aria-disabled={local.disabled}
				aria-invalid={invalid() || undefined}
				class={`solidui-dropzone flex flex-col items-center justify-center gap-2 border-2 border-dashed text-center motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
					dragging() ? "border-primary bg-primary/5" : invalid() ? "border-destructive" : "border-border"
				} ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${
					local.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/60"
				} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
				onDragOver={(e) => {
					e.preventDefault();
					if (!local.disabled) setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragging(false);
					if (!local.disabled) emit(e.dataTransfer?.files ?? null);
				}}
				onClick={() => !local.disabled && inputRef?.click()}
				onKeyDown={(e) => {
					if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
						e.preventDefault();
						inputRef?.click();
					}
				}}
				{...rest}
			>
				<input
					ref={inputRef}
					type="file"
					class="hidden"
					accept={local.accept}
					multiple={local.multiple}
					disabled={local.disabled}
					onChange={(e) => {
						emit(e.currentTarget.files);
						e.currentTarget.value = "";
					}}
				/>
				{local.children ?? (
					<>
						<svg
							class="h-8 w-8 text-muted-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							aria-hidden="true"
						>
							<path d="M12 16V4m0 0 4 4m-4-4-4 4" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke-linecap="round" />
						</svg>
						<span class={`font-medium text-foreground ${titleSize[local.size ?? "md"]}`}>
							{local.title ?? "Drop files here"}
						</span>
						<Show when={!local.hideBrowse}>
							<span class="text-xs text-muted-foreground">
								{local.hint ?? "or click to browse"}
								{local.accept ? ` · ${local.accept}` : ""}
							</span>
						</Show>
					</>
				)}
			</div>
			<Show when={listVisible()}>
				<ul class="mt-2 space-y-0.5" aria-live="polite">
					<For each={files()}>
						{(file, index) => (
							<li class="flex items-center gap-2 text-xs text-muted-foreground">
								<button
									type="button"
									class="rounded p-0.5 transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									aria-label={`Remove ${file.name}`}
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
								<span class="break-all">{file.name}</span>
								<span class="shrink-0 tabular-nums">{formatBytes(file.size)}</span>
							</li>
						)}
					</For>
				</ul>
				<Show when={local.clearable}>
					<button
						type="button"
						class="mt-1 text-xs font-medium text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						aria-label="Clear files"
						onClick={clearAll}
					>
						Clear all
					</button>
				</Show>
			</Show>
			<Show when={errorText()}>
				<p role="alert" class="mt-1 text-xs text-destructive">
					{errorText()}
				</p>
			</Show>
			<Show when={rejected().length > 0}>
				<p role="alert" class="mt-1 text-xs text-destructive">
					{rejected()
						.map((f) =>
							local.maxSize !== undefined && f.size > local.maxSize
								? `${f.name} exceeds the ${formatBytes(local.maxSize)} limit`
								: `${f.name} exceeds the file count limit`,
						)
						.join(", ")}
				</p>
			</Show>
		</div>
	);
}
