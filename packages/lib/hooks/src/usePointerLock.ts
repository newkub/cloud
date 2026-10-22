import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface PointerLockControls {
	/** True while any element holds the pointer lock */
	locked: Accessor<boolean>;
	/** Request the pointer lock on the target element — no-op when unsupported */
	request: () => Promise<void>;
	/** Release the pointer lock — no-op when nothing is locked */
	release: () => void;
	/** Whether the Pointer Lock API exists */
	supported: boolean;
}

/**
 * Pointer Lock API as signals — `request()` locks the target element (hides the
 * cursor for raw mouse deltas, e.g. games/3D), `release()` exits and `locked()`
 * tracks `pointerlockchange` on the document.
 *
 * @param target — Element or accessor for the element to lock
 * @returns `{ locked, request, release, supported }`
 *
 * @example
 * const [el, setEl] = createSignal<HTMLElement>();
 * const lock = usePointerLock(el);
 * <div ref={setEl} onClick={() => lock.request()}>click to capture mouse</div>
 */
export function usePointerLock(target: MaybeAccessor<HTMLElement | undefined>): PointerLockControls {
	const [locked, setLocked] = createSignal(false);
	const supported =
		typeof document !== "undefined" &&
		"pointerLockElement" in document &&
		typeof Element !== "undefined" &&
		"requestPointerLock" in Element.prototype;

	onMount(() => {
		const read = () => setLocked(!!document.pointerLockElement);
		read();
		document.addEventListener("pointerlockchange", read);
		onCleanup(() => document.removeEventListener("pointerlockchange", read));
	});

	return {
		locked,
		supported,
		request: async () => {
			const el = resolve(target);
			if (!el || typeof el.requestPointerLock !== "function") return;
			await el.requestPointerLock();
		},
		release: () => {
			if (typeof document !== "undefined" && document.pointerLockElement) {
				document.exitPointerLock();
			}
		},
	};
}
