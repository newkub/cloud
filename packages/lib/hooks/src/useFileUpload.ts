import { type Accessor, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface UseFileUploadOptions<T> {
	/** Destination URL (static or accessor). */
	url?: string | Accessor<string>;
	/** HTTP verb. @default "POST" */
	method?: string;
	/** Accessor returning extra request headers. */
	headers?: Accessor<Record<string, string>>;
	/** Accessor returning extra `FormData` fields sent alongside each file. */
	data?: Accessor<Record<string, string>>;
	/** Send cookies with the request (`xhr.withCredentials`). @default false */
	withCredentials?: boolean;
	/** Called on every byte of upload progress with a 0–100 percent value. */
	onProgress?: (percent: number, file: File) => void;
	/** Called after a single file finishes uploading. */
	onFinish?: (response: T, file: File) => void;
	/** Called when a file fails to upload. */
	onError?: (e: unknown, file: File) => void;
	/** Parse the response body as JSON before handing it to `onFinish`. @default false */
	json?: boolean;
	/** Accepted for API parity; uploads run through `XMLHttpRequest` for progress. */
	fetchApi?: typeof fetch;
}

export interface UseFileUploadReturn<T> {
	/** The most recent selection (a `FileList` when one was passed to `upload`). */
	files: Accessor<FileList | null>;
	/** Upload progress of the current file, 0–100. */
	progress: Accessor<number>;
	/** Last upload failure (an `Error` or thrown value). */
	error: Accessor<unknown>;
	/** True once every queued file finished successfully. */
	isFinished: Accessor<boolean>;
	/** True while an upload is in flight. */
	isUploading: Accessor<boolean>;
	/** Upload files sequentially, merging per-call overrides with hook options. */
	upload: (files: FileList | File[], overrides?: Partial<UseFileUploadOptions<T>>) => Promise<T | undefined>;
	/** Reset every signal back to its idle value. */
	clear: () => void;
}

/**
 * Imperative multi-file upload driven by `XMLHttpRequest` so real byte-level
 * progress is reported. Files upload sequentially, each in its own `FormData`.
 * The response is optionally parsed as JSON (`json: true`) and returned from
 * `upload()`; failures surface through the `error()` accessor and the
 * `onError` callback instead of rejecting.
 *
 * @param options — See {@link UseFileUploadOptions}
 * @returns `{ files, progress, error, isFinished, isUploading, upload, clear }`
 *
 * @example
 * const up = useFileUpload<{ id: string }>({ url: "/api/upload", json: true });
 * await up.upload(inputRef.files);
 * <progress value={up.progress()} max={100} />
 */
export function useFileUpload<T = void>(options?: UseFileUploadOptions<T>): UseFileUploadReturn<T> {
	const [files, setFiles] = createSignal<FileList | null>(null);
	const [progress, setProgress] = createSignal(0);
	const [error, setError] = createSignal<unknown>();
	const [isFinished, setIsFinished] = createSignal(false);
	const [isUploading, setIsUploading] = createSignal(false);

	const uploadOne = (file: File, merged: UseFileUploadOptions<T>): Promise<T | undefined> =>
		new Promise<T | undefined>((resolve, reject) => {
			if (typeof XMLHttpRequest === "undefined") {
				reject(new Error("XMLHttpRequest unavailable"));
				return;
			}
			const xhr = new XMLHttpRequest();
			const form = new FormData();
			form.append("file", file);
			const extra = merged.data ? read(merged.data) : undefined;
			if (extra) for (const [key, value] of Object.entries(extra)) form.append(key, value);

			xhr.open(merged.method ?? "POST", read(merged.url ?? ""), true);
			if (merged.withCredentials) xhr.withCredentials = true;
			const headers = merged.headers ? read(merged.headers) : undefined;
			if (headers) for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);

			xhr.upload.addEventListener("progress", (e) => {
				if (e.lengthComputable) {
					const percent = (e.loaded / e.total) * 100;
					setProgress(percent);
					merged.onProgress?.(percent, file);
				}
			});
			xhr.addEventListener("load", () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					let response: T | undefined;
					try {
						response = merged.json ? (JSON.parse(xhr.responseText) as T) : (xhr.responseText as unknown as T);
					} catch (e) {
						reject(e);
						return;
					}
					merged.onFinish?.(response as T, file);
					resolve(response);
				} else {
					reject(new Error(`Upload failed with status ${xhr.status}`));
				}
			});
			xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
			xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
			xhr.send(form);
		});

	const upload = async (
		next: FileList | File[],
		overrides?: Partial<UseFileUploadOptions<T>>,
	): Promise<T | undefined> => {
		const merged: UseFileUploadOptions<T> = { ...options, ...overrides };
		const list = Array.from(next);
		setFiles(next instanceof FileList ? next : null);
		setProgress(0);
		setError(undefined);
		setIsFinished(false);
		setIsUploading(true);
		let last: T | undefined;
		try {
			for (const file of list) {
				last = await uploadOne(file, merged);
				setProgress(100);
			}
			setIsFinished(true);
			return last;
		} catch (e) {
			setError(e);
			const failed = list.at(-1);
			if (failed) merged.onError?.(e, failed);
			setIsFinished(false);
			return undefined;
		} finally {
			setIsUploading(false);
		}
	};

	const clear = () => {
		setFiles(null);
		setProgress(0);
		setError(undefined);
		setIsFinished(false);
		setIsUploading(false);
	};

	return { files, progress, error, isFinished, isUploading, upload, clear };
}
