import { type Accessor, createEffect, createRoot, onCleanup } from "solid-js";

/** Resolves `true` when the tracked element leaves the document (SSR resolves `false`). */
export type ElementRemovalPromise = Promise<boolean>;

/**
 * Promise that resolves the moment `target` is removed from the DOM —
 * a `MutationObserver` watches `document.documentElement` and checks whether
 * the element is still contained. A target that is already detached resolves
 * immediately. When `target` is an accessor and its element changes, tracking
 * switches to the new element. Disposing the owning scope disconnects the
 * observer and cancels the pending resolution (the promise stays unresolved).
 *
 * @param target — Element or accessor returning one (`undefined` pauses tracking)
 * @returns `Promise<boolean>` — `true` once removal is observed
 *
 * @example
 * const [el, setEl] = createSignal<Element>();
 * setEl(ref);
 * await useElementRemoval(el); // continues after the node is unmounted
 */
export function useElementRemoval(target: Accessor<Element | undefined> | Element): ElementRemovalPromise {
	const get = typeof target === "function" ? (target as Accessor<Element | undefined>) : () => target;
	return new Promise<boolean>((resolve) => {
		if (typeof document === "undefined") {
			resolve(false); // SSR — nothing to observe
			return;
		}
		const dispose = createRoot((d) => {
			let done = false;
			let observer: MutationObserver | undefined;
			const detach = () => {
				done = true;
				observer?.disconnect();
				observer = undefined;
			};
			const finish = () => {
				if (done) return;
				detach();
				resolve(true);
				queueMicrotask(() => d());
			};
			createEffect(() => {
				if (done) return;
				const el = get();
				observer?.disconnect();
				observer = undefined;
				if (!el) return;
				if (!document.contains(el)) {
					finish();
					return;
				}
				observer = new MutationObserver(() => {
					if (!document.contains(el)) finish();
				});
				observer.observe(document.documentElement, { childList: true, subtree: true });
			});
			onCleanup(detach);
			return () => {
				detach();
				d();
			};
		});
		onCleanup(dispose);
	});
}
