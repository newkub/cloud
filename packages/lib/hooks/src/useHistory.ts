import { type Accessor, createMemo, createSignal, untrack } from "solid-js";

export interface HistoryControls<T> {
	/** Current value */
	current: Accessor<T>;
	/** Push a new value — records the previous one and clears the redo stack */
	set: (value: T) => void;
	/** Step back one entry — no-op when `canUndo()` is false */
	undo: () => void;
	/** Step forward one entry — no-op when `canRedo()` is false */
	redo: () => void;
	canUndo: Accessor<boolean>;
	canRedo: Accessor<boolean>;
	/** Past snapshots plus the current value, oldest first */
	history: Accessor<T[]>;
}

/**
 * Undo/redo history for a value. Pass an accessor to record every change the
 * source emits, or a plain value to drive history only via `set`.
 * `capacity` caps how many past snapshots are kept.
 *
 * @param source — Accessor to track, or an initial value
 * @param options — `capacity` limits stored past entries
 * @returns `{ current, set, undo, redo, canUndo, canRedo, history }`
 *
 * @example
 * const doc = useHistory({ text: "" }, { capacity: 100 });
 * doc.set({ text: "draft" });
 * <button onClick={doc.undo} disabled={!doc.canUndo()}>undo</button>
 */
export function useHistory<T>(
	source: Accessor<T> | T,
	options?: {
		/** Maximum number of past snapshots retained — oldest are dropped. */
		capacity?: number;
	},
): HistoryControls<T> {
	const tracking = typeof source === "function";
	const initial = tracking ? (source as Accessor<T>)() : (source as T);
	const [present, setPresent] = createSignal<T>(initial);
	const [past, setPast] = createSignal<T[]>([]);
	const [future, setFuture] = createSignal<T[]>([]);
	let last = initial;

	const pushPast = (value: T) =>
		setPast((p) => {
			const next = [...p, value];
			const cap = options?.capacity;
			return cap !== undefined && next.length > cap ? next.slice(next.length - cap) : next;
		});

	const commit = (value: T) => {
		last = value;
		pushPast(untrack(present));
		setPresent(() => value);
		setFuture([]);
	};

	if (tracking) {
		createMemo(() => {
			const value = (source as Accessor<T>)();
			if (value !== last) commit(value);
		});
	}

	return {
		current: present,
		set: commit,
		undo: () => {
			const p = past();
			if (p.length === 0) return;
			const prev = p[p.length - 1];
			if (prev === undefined) return;
			setPast(p.slice(0, -1));
			setFuture((f) => [untrack(present), ...f]);
			last = prev;
			setPresent(() => prev);
		},
		redo: () => {
			const f = future();
			if (f.length === 0) return;
			const [next, ...rest] = f;
			if (next === undefined) return;
			setFuture(rest);
			pushPast(untrack(present));
			last = next;
			setPresent(() => next);
		},
		canUndo: () => past().length > 0,
		canRedo: () => future().length > 0,
		history: () => [...past(), present()],
	};
}
