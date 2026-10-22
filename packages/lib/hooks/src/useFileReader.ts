import { type Accessor, createSignal } from "solid-js";

export interface FileReaderState {
	/** Latest read result — data URL from `read()`, text from `readText()` */
	result: Accessor<string | undefined>;
	/** True while a read is in flight */
	loading: Accessor<boolean>;
	/** Last read error message */
	error: Accessor<string | undefined>;
	/** Whether the FileReader API exists */
	supported: boolean;
	/** Read a Blob/File as a data URL */
	read: (file: Blob) => void;
	/** Read a Blob/File as UTF-8 text */
	readText: (file: Blob) => void;
	/** Reset result/error back to empty */
	clear: () => void;
}

/**
 * FileReader as signals — `read()` produces a data URL, `readText()` plain
 * text; `result()` always holds the latest string. Missing API reports through
 * `error()` instead of throwing.
 *
 * @returns `{ result, loading, error, supported, read, readText, clear }`
 *
 * @example
 * const fr = useFileReader();
 * <input type="file" onChange={(e) => fr.read(e.currentTarget.files![0])} />
 * <Show when={fr.result()}><img src={fr.result()} /></Show>
 */
export function useFileReader(): FileReaderState {
	const [result, setResult] = createSignal<string>();
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<string>();
	const supported = typeof FileReader !== "undefined";

	const run = (file: Blob, method: "readAsDataURL" | "readAsText") => {
		if (!supported) {
			setError("FileReader unavailable");
			return;
		}
		const reader = new FileReader();
		setLoading(true);
		setError(undefined);
		reader.onload = () => {
			setResult(typeof reader.result === "string" ? reader.result : undefined);
			setLoading(false);
		};
		reader.onerror = () => {
			setError(reader.error?.message ?? "read failed");
			setLoading(false);
		};
		reader[method](file);
	};

	return {
		result,
		loading,
		error,
		supported,
		read: (file) => run(file, "readAsDataURL"),
		readText: (file) => run(file, "readAsText"),
		clear: () => {
			setResult(undefined);
			setError(undefined);
		},
	};
}
