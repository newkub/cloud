import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ScrollLockControls {
	/** True while the scroll lock is applied */
	locked: Accessor<boolean>;
	/** Apply `overflow: hidden` to the target */
	lock: () => void;
	/** Restore the previous `overflow` value */
	unlock: () => void;
}

/**
 * Lock scroll on an element — defaults to `document.body`. Pass an element
 * accessor to lock a scroll container instead, or an `Accessor<boolean>` to
 * drive the lock reactively (e.g. tie it to a dialog's `open` signal).
 * The previous `overflow` is restored on unlock and unmount. SSR-safe.
 *
 * @param target — Element accessor (falls back to body) or boolean accessor that drives the lock
 * @returns `{ locked, lock, unlock }`
 *
 * @example
 * const { locked, lock, unlock } = useScrollLock();
 * useScrollLock(open); // reactive: locks body while open() is true
 */
export function useScrollLock(target?: Accessor<HTMLElement | undefined> | Accessor<boolean>): ScrollLockControls {
	const [locked, setLocked] = createSignal(false);
	let el: HTMLElement | undefined;
	let previous = "";

	const resolveEl = (): HTMLElement | undefined => {
		if (typeof document === "undefined") return undefined;
		const v = target?.();
		if (typeof v === "boolean") return document.body;
		return v ?? document.body;
	};

	const lock = () => {
		if (locked()) return;
		const node = resolveEl();
		if (!node) return;
		el = node;
		previous = node.style.overflow;
		node.style.overflow = "hidden";
		setLocked(true);
	};

	const unlock = () => {
		if (!locked()) return;
		if (el) el.style.overflow = previous;
		el = undefined;
		setLocked(false);
	};

	createEffect(() => {
		const v = target?.();
		if (typeof v === "boolean") {
			if (v) lock();
			else unlock();
			return;
		}
		// Element mode: move the lock if the bound element changes mid-lock.
		if (locked() && v && v !== el) {
			if (el) el.style.overflow = previous;
			el = v;
			previous = v.style.overflow;
			v.style.overflow = "hidden";
		}
	});

	onCleanup(unlock);

	return { locked, lock, unlock };
}
