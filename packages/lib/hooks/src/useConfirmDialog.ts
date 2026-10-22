import { type Accessor, createSignal } from "solid-js";

/** Options for {@link useConfirmDialog}. */
export interface ConfirmDialogOptions {
	/** Calling `reveal()` again while already revealed settles the pending promise with `-1` (cancel) before starting a new one. @default false */
	reactive?: boolean;
}

/** State and controls returned by {@link useConfirmDialog}. */
export interface ConfirmDialogState {
	/** True between `reveal()` and the next `set()`/`confirm()`/`reject()`/`cancel()`. */
	isRevealed: Accessor<boolean>;
	/** Show the dialog; resolves `1` (confirm), `0` (reject) or `-1` (cancel). */
	reveal: () => Promise<number>;
	/** Settle the pending reveal with an arbitrary value and hide the dialog. */
	set: (value: number) => void;
	/** Shortcut for `set(1)` — also fires `onConfirm` listeners. */
	confirm: () => void;
	/** Shortcut for `set(0)` — also fires `onReject` listeners. */
	reject: () => void;
	/** Shortcut for `set(-1)` — also fires `onCancel` listeners. */
	cancel: () => void;
	/** Register a confirm listener; returns an unsubscribe function. */
	onConfirm: (cb: () => void) => () => void;
	/** Register a reject listener; returns an unsubscribe function. */
	onReject: (cb: () => void) => () => void;
	/** Register a cancel listener; returns an unsubscribe function. */
	onCancel: (cb: () => void) => () => void;
}

/**
 * Promise-based confirm dialog controller. `reveal()` returns a promise that
 * resolves once the app settles the dialog via `confirm()` / `reject()` /
 * `cancel()` / `set()`. Multiple listeners may be attached per outcome; each
 * registration returns its own unsubscribe handle.
 *
 * @param options — `reactive` supersedes a pending reveal with `-1`
 * @returns `{ isRevealed, reveal, set, confirm, reject, cancel, onConfirm, onReject, onCancel }`
 *
 * @example
 * const dialog = useConfirmDialog();
 * const accepted = (await dialog.reveal()) === 1;
 * dialog.onConfirm(() => deleteItem());
 * <Show when={dialog.isRevealed()}><YesNo onYes={dialog.confirm} onNo={dialog.reject} /></Show>
 */
export function useConfirmDialog(options?: ConfirmDialogOptions): ConfirmDialogState {
	const [isRevealed, setRevealed] = createSignal(false);
	const confirms = new Set<() => void>();
	const rejects = new Set<() => void>();
	const cancels = new Set<() => void>();
	let resolve: ((value: number) => void) | undefined;
	let promise: Promise<number> | undefined;

	const subscribe = (bucket: Set<() => void>, cb: () => void) => {
		bucket.add(cb);
		return () => {
			bucket.delete(cb);
		};
	};
	const emit = (bucket: Set<() => void>) => {
		for (const cb of [...bucket]) cb();
	};

	const reveal = (): Promise<number> => {
		if (promise && resolve) {
			if (!options?.reactive) return promise;
			set(-1); // superseded reveals count as cancel
		}
		setRevealed(true);
		promise = new Promise<number>((r) => {
			resolve = r;
		});
		return promise;
	};

	const set = (value: number) => {
		const r = resolve;
		if (!r) return;
		setRevealed(false);
		promise = undefined;
		resolve = undefined;
		r(value);
		if (value === 1) emit(confirms);
		else if (value === 0) emit(rejects);
		else if (value === -1) emit(cancels);
	};

	return {
		isRevealed,
		reveal,
		set,
		confirm: () => set(1),
		reject: () => set(0),
		cancel: () => set(-1),
		onConfirm: (cb) => subscribe(confirms, cb),
		onReject: (cb) => subscribe(rejects, cb),
		onCancel: (cb) => subscribe(cancels, cb),
	};
}
