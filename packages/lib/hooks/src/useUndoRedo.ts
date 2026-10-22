import { type Accessor, createMemo, createSignal } from "solid-js";

export interface UndoRedoControls<T> {
	/** Current (present) value */
	value: Accessor<T>;
	/** Push a new value — accepts a value or an updater, clears the redo stack */
	set: (value: T | ((prev: T) => T)) => void;
	/** Step back one entry — returns whether it moved */
	undo: () => boolean;
	/** Step forward one entry — returns whether it moved */
	redo: () => boolean;
	/** True when `undo()` has somewhere to go */
	canUndo: Accessor<boolean>;
	/** True when `redo()` has somewhere to go */
	canRedo: Accessor<boolean>;
	/** `past → present → future` snapshot for history UIs */
	history: Accessor<T[]>;
	/** Drop all past and future entries — keeps the current value */
	clear: () => void;
}

/**
 * Past/present/future stacks — `set` pushes the present onto `past` and clears
 * `future`, `undo`/`redo` shuttle entries between the stacks. `limit` caps how
 * many past entries are kept (oldest dropped first).
 *
 * @param initial — Initial present value
 * @param options — `limit` caps the past stack. @default unlimited
 * @returns `{ value, set, undo, redo, canUndo, canRedo, history, clear }`
 *
 * @example
 * const doc = useUndoRedo("");
 * <input value={doc.value()} onInput={(e) => doc.set(e.currentTarget.value)} />
 * <button onClick={doc.undo} disabled={!doc.canUndo()}>undo</button>
 * <button onClick={doc.redo} disabled={!doc.canRedo()}>redo</button>
 */
export function useUndoRedo<T>(initial: T, options?: { limit?: number }): UndoRedoControls<T> {
	const [value, setValue] = createSignal<T>(initial);
	const [past, setPast] = createSignal<T[]>([]);
	const [future, setFuture] = createSignal<T[]>([]);

	const set = (next: T | ((prev: T) => T)) => {
		const resolved = typeof next === "function" ? (next as (prev: T) => T)(value()) : next;
		setPast((p) => {
			const grown = [...p, value()];
			const limit = options?.limit;
			return limit !== undefined && grown.length > limit ? grown.slice(grown.length - limit) : grown;
		});
		setValue(() => resolved);
		setFuture([]);
	};

	const undo = () => {
		const p = past();
		if (p.length === 0) return false;
		setFuture((f) => [value(), ...f]);
		setValue(() => p[p.length - 1] as T);
		setPast(p.slice(0, -1));
		return true;
	};

	const redo = () => {
		const f = future();
		if (f.length === 0) return false;
		setPast((p) => [...p, value()]);
		setValue(() => f[0] as T);
		setFuture(f.slice(1));
		return true;
	};

	return {
		value,
		set,
		undo,
		redo,
		canUndo: createMemo(() => past().length > 0),
		canRedo: createMemo(() => future().length > 0),
		history: createMemo(() => [...past(), value(), ...future()]),
		clear: () => {
			setPast([]);
			setFuture([]);
		},
	};
}
