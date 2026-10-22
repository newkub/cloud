import { type Accessor, createSignal } from "solid-js";

export interface FileSystemWritableLike {
	write(data: Blob | string | ArrayBuffer): Promise<void>;
	close(): Promise<void>;
}

export interface FileSystemFileHandleLike {
	readonly kind: "file";
	readonly name: string;
	getFile(): Promise<File>;
	createWritable(): Promise<FileSystemWritableLike>;
}

export interface FileSystemDirectoryHandleLike {
	readonly kind: "directory";
	readonly name: string;
}

export interface FilePickerAcceptType {
	description?: string;
	accept: Record<string, readonly string[]>;
}

export interface FileSystemAccessOptions {
	/** Accepted file types for open/save pickers */
	types?: readonly FilePickerAcceptType[];
	/** Let the user pick several files in `openFile` — only the first file is returned */
	multiple?: boolean;
	/** Exclude the "accept all" option in pickers */
	excludeAcceptAllOption?: boolean;
	/** Suggested file name for `saveFile` */
	suggestedName?: string;
	/** `"read"` or `"readwrite"` starting mode for `openDirectory` */
	mode?: "read" | "readwrite";
	/** Well-known start location, e.g. `"documents"`, `"pictures"` */
	startIn?: string;
	/** Directory/file handle to start the picker in */
	id?: string;
}

interface WindowWithPickers {
	showOpenFilePicker?: (options?: Record<string, unknown>) => Promise<FileSystemFileHandleLike[]>;
	showSaveFilePicker?: (options?: Record<string, unknown>) => Promise<FileSystemFileHandleLike>;
	showDirectoryPicker?: (options?: Record<string, unknown>) => Promise<FileSystemDirectoryHandleLike>;
}

const pickers = (): WindowWithPickers | undefined =>
	typeof window === "undefined" ? undefined : (window as unknown as WindowWithPickers);

export interface FileSystemAccessState {
	/** File System Access picker support flag (secure context + Chromium) */
	supported: boolean;
	/** Show the open picker and resolve the selected `File` — `undefined` on cancel/error/unsupported */
	openFile: (options?: FileSystemAccessOptions) => Promise<File | undefined>;
	/** Show the save picker and write `data` to the chosen file — resolves `true` on success */
	saveFile: (data: Blob | string | ArrayBuffer, options?: FileSystemAccessOptions) => Promise<boolean>;
	/** Show the directory picker and resolve its handle — `undefined` on cancel/error/unsupported */
	openDirectory: (options?: FileSystemAccessOptions) => Promise<FileSystemDirectoryHandleLike | undefined>;
	/** Last picker error message (user cancel included) */
	error: Accessor<string | undefined>;
}

/**
 * File System Access pickers as functions — `openFile` /
 * `saveFile` / `openDirectory` wrap `showOpenFilePicker`,
 * `showSaveFilePicker`, and `showDirectoryPicker` (each requires a user
 * gesture). Cancelling or unsupported environments resolve
 * `undefined`/`false` instead of throwing; the message lands in `error()`.
 *
 * @returns `{ supported, openFile, saveFile, openDirectory, error }`
 *
 * @example
 * const fs = useFileSystemAccess();
 * <button onClick={async () => setDoc(await fs.openFile({ types: [{ accept: { "text/plain": [".txt"] } }] }))}>
 *   open…
 * </button>
 */
export function useFileSystemAccess(): FileSystemAccessState {
	const w = pickers();
	const supported =
		typeof w?.showOpenFilePicker === "function" &&
		typeof w?.showSaveFilePicker === "function" &&
		typeof w?.showDirectoryPicker === "function";
	const [error, setError] = createSignal<string>();

	const fail = (e: unknown, fallback: string) => {
		setError(e instanceof Error ? e.message : fallback);
		return undefined;
	};

	const openFile = async (options?: FileSystemAccessOptions): Promise<File | undefined> => {
		const api = pickers();
		if (!api?.showOpenFilePicker) return undefined;
		try {
			const [handle] = await api.showOpenFilePicker(options as Record<string, unknown> | undefined);
			const file = await handle?.getFile();
			setError(undefined);
			return file;
		} catch (e) {
			return fail(e, "showOpenFilePicker failed");
		}
	};

	const saveFile = async (data: Blob | string | ArrayBuffer, options?: FileSystemAccessOptions): Promise<boolean> => {
		const api = pickers();
		if (!api?.showSaveFilePicker) return false;
		try {
			const handle = await api.showSaveFilePicker(options as Record<string, unknown> | undefined);
			const writable = await handle.createWritable();
			await writable.write(data);
			await writable.close();
			setError(undefined);
			return true;
		} catch (e) {
			fail(e, "showSaveFilePicker failed");
			return false;
		}
	};

	const openDirectory = async (
		options?: FileSystemAccessOptions,
	): Promise<FileSystemDirectoryHandleLike | undefined> => {
		const api = pickers();
		if (!api?.showDirectoryPicker) return undefined;
		try {
			const handle = await api.showDirectoryPicker(options as Record<string, unknown> | undefined);
			setError(undefined);
			return handle;
		} catch (e) {
			return fail(e, "showDirectoryPicker failed");
		}
	};

	return { supported, openFile, saveFile, openDirectory, error };
}
