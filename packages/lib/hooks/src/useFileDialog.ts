import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface UseFileDialogOptions {
	/** `accept` attribute — comma-separated extensions, MIME types or `audio/*` filters */
	accept?: string;
	/** Allow selecting more than one file. @default false */
	multiple?: boolean;
	/** Clear the input value after each selection so re-picking the same file still fires `change`. @default true */
	reset?: boolean;
	/** Let the user pick a whole directory (`webkitdirectory`). @default false */
	directoryPick?: boolean;
}

export interface UseFileDialogReturn {
	/** Open the native picker by clicking the hidden input (no-op during SSR) */
	open: () => void;
	/** Subscribe to selections — returns an unsubscribe function */
	onChange: (cb: (files: FileList | null) => void) => () => void;
	/** Subscribe to input errors — returns an unsubscribe function */
	onError: (cb: (e: Error) => void) => () => void;
	/** Subscribe to picker cancellation — returns an unsubscribe function */
	onCancel: (cb: () => void) => () => void;
	/** Clear the current selection and the underlying input value */
	reset: () => void;
	/** Latest selection — `null` before the first pick */
	files: Accessor<FileList | null>;
}

/**
 * A programmatic file picker backed by a hidden `<input type="file">` created
 * at setup. `open()` triggers the native dialog; `files()` holds the latest
 * selection and `onChange`/`onError`/`onCancel` register subscribers that each
 * return an unsubscribe function. The input is removed on cleanup.
 *
 * @param options — See {@link UseFileDialogOptions}
 * @returns `{ open, onChange, onError, onCancel, reset, files }`
 *
 * @example
 * const dialog = useFileDialog({ accept: "image/*", multiple: true });
 * <button onClick={dialog.open}>pick</button>
 * <For each={dialog.files()}>{(f) => <span>{f.name}</span>}</For>
 */
export function useFileDialog(options?: UseFileDialogOptions): UseFileDialogReturn {
	const [files, setFiles] = createSignal<FileList | null>(null);
	const changeCbs = new Set<(files: FileList | null) => void>();
	const errorCbs = new Set<(e: Error) => void>();
	const cancelCbs = new Set<() => void>();
	const shouldReset = options?.reset ?? true;
	let input: HTMLInputElement | undefined;

	if (typeof document !== "undefined") {
		input = document.createElement("input");
		input.type = "file";
		input.accept = options?.accept ?? "";
		input.multiple = options?.multiple ?? false;
		if (options?.directoryPick) input.setAttribute("webkitdirectory", "");
		Object.assign(input.style, {
			position: "absolute",
			width: "1px",
			height: "1px",
			padding: "0",
			margin: "-1px",
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			border: "0",
		});

		const onChange = () => {
			const list = input?.files ?? null;
			setFiles(list);
			for (const cb of [...changeCbs]) cb(list);
			if (shouldReset && input) input.value = "";
		};
		const onCancel = () => {
			for (const cb of [...cancelCbs]) cb();
		};
		const onError = (e: Event) => {
			const target = e as unknown as { target?: { validationMessage?: string } };
			const message = target.target?.validationMessage ?? "file input error";
			for (const cb of [...errorCbs]) cb(new Error(message));
		};

		input.addEventListener("change", onChange);
		input.addEventListener("cancel", onCancel);
		input.addEventListener("error", onError);
		document.body.appendChild(input);

		onCleanup(() => {
			input?.removeEventListener("change", onChange);
			input?.removeEventListener("cancel", onCancel);
			input?.removeEventListener("error", onError);
			input?.remove();
		});
	}

	return {
		open: () => input?.click(),
		onChange: (cb) => {
			changeCbs.add(cb);
			return () => changeCbs.delete(cb);
		},
		onError: (cb) => {
			errorCbs.add(cb);
			return () => errorCbs.delete(cb);
		},
		onCancel: (cb) => {
			cancelCbs.add(cb);
			return () => cancelCbs.delete(cb);
		},
		reset: () => {
			setFiles(null);
			if (input) input.value = "";
		},
		files,
	};
}
