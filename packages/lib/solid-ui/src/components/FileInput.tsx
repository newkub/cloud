/**
 * FileInput — file picker with size validation, file list and clear/remove actions.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

const formatBytes = (bytes: number) => {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${bytes} B`;
};

let fileInputId = 0;

export interface FileInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "size"> {
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (files: File[]) => void;
	/** Maximum allowed file size in bytes — larger files are rejected. */
	maxSize?: number;
	/** Called with the files rejected by `maxSize`. */
	onReject?: (files: File[]) => void;
	/** Render each chosen file as a removable list item. @default false */
	removable?: boolean;
	/** Show a clear-all button once files are chosen. @default false */
	clearable?: boolean;
	/** Accessible label for the clear-all button. @default "Clear files" */
	clearLabel?: string;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}

export function FileInput(props: FileInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"onChange",
		"onReject",
		"maxSize",
		"removable",
		"clearable",
		"clearLabel",
		"error",
		"description",
		"accept",
		"multiple",
		"disabled",
		"radius",
	]);
	const autoId = `solidui-file-${++fileInputId}`;
	const id = () => local.id ?? autoId;
	const [files, setFiles] = createSignal<File[]>([]);
	const [rejected, setRejected] = createSignal<File[]>([]);
	let inputRef: HTMLInputElement | undefined;

	const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
		const list = (e.currentTarget as HTMLInputElement).files;
		const picked = list ? Array.from(list) : [];
		const accepted = local.maxSize !== undefined ? picked.filter((f) => f.size <= (local.maxSize ?? 0)) : picked;
		const rejectedFiles = picked.filter((f) => !accepted.includes(f));
		setRejected(rejectedFiles);
		setFiles(accepted);
		if (accepted.length) local.onChange?.(accepted);
		if (rejectedFiles.length) local.onReject?.(rejectedFiles);
	};

	const removeAt = (index: number) => {
		const next = files().filter((_, i) => i !== index);
		setFiles(next);
		local.onChange?.(next);
	};

	const clearAll = () => {
		setFiles([]);
		setRejected([]);
		if (inputRef) inputRef.value = "";
		local.onChange?.([]);
	};

	const invalid = () => (local.error !== undefined && local.error !== false) || rejected().length > 0;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[
			local.description ? `${id()}-desc` : "",
			errorText() ? `${id()}-error` : "",
			rejected().length ? `${id()}-reject` : "",
		]
			.filter(Boolean)
			.join(" ") || undefined;

	const inputBase =
		"flex w-full cursor-pointer border transition-colors motion-reduce:transition-none file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const inputClass = () =>
		[
			inputBase,
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class="w-full space-y-1">
			<input
				id={id()}
				ref={inputRef}
				type="file"
				accept={local.accept}
				multiple={local.multiple}
				disabled={local.disabled}
				onChange={handleChange}
				class={inputClass()}
				aria-invalid={invalid() || undefined}
				aria-describedby={describedBy()}
				{...rest}
			/>
			<Show when={files().length > 0} fallback={<span class="text-xs text-muted-foreground">No file chosen</span>}>
				<Show
					when={local.removable || local.clearable}
					fallback={
						<span class="break-all text-xs text-muted-foreground" aria-live="polite">
							{files()
								.map((file) => file.name)
								.join(", ")}
						</span>
					}
				>
					<ul class="space-y-0.5" aria-live="polite">
						<For each={files()}>
							{(file, index) => (
								<li class="flex items-center gap-2 text-xs text-muted-foreground">
									<Show when={local.removable}>
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
									</Show>
									<span class="break-all">{file.name}</span>
									<span class="shrink-0 tabular-nums">{formatBytes(file.size)}</span>
								</li>
							)}
						</For>
					</ul>
					<Show when={local.clearable}>
						<button
							type="button"
							class="text-xs font-medium text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							aria-label={local.clearLabel ?? "Clear files"}
							onClick={clearAll}
						>
							Clear all
						</button>
					</Show>
				</Show>
			</Show>
			<Show when={local.description}>
				<p id={`${id()}-desc`} class="text-xs text-muted-foreground">
					{local.description}
				</p>
			</Show>
			<Show when={errorText()}>
				<p id={`${id()}-error`} role="alert" class="text-xs text-destructive">
					{errorText()}
				</p>
			</Show>
			<Show when={rejected().length > 0}>
				<p id={`${id()}-reject`} role="alert" class="text-xs text-destructive">
					{rejected()
						.map((f) => `${f.name} exceeds the ${formatBytes(local.maxSize ?? 0)} limit`)
						.join(", ")}
				</p>
			</Show>
		</div>
	);
}
