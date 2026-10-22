import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface MutationObserverControls {
	/** True while the observer is connected */
	observing: Accessor<boolean>;
	/** Disconnect the observer — records stop until `resume()` */
	pause: () => void;
	/** Re-observe the current target after `pause()` */
	resume: () => void;
	/** Drain queued-but-undelivered mutation records */
	takeRecords: () => MutationRecord[];
}

/**
 * Observe DOM mutations on an element — attribute, childList, subtree changes.
 * Re-observes when `target()` resolves to a different element.
 * Returns `{ observing, pause, resume, takeRecords }` controls.
 *
 * @param target — Accessor for the element to observe
 * @param callback — MutationObserver callback
 * @param options — MutationObserverInit. @default `{ attributes: true, childList: true, subtree: true }`
 * @returns `{ observing, pause, resume, takeRecords }`
 *
 * @example
 * const mo = useMutationObserver(() => list, (records) => bump(), { childList: true });
 * mo.pause(); mo.resume();
 */
export function useMutationObserver(
	target: Accessor<Element | undefined>,
	callback: MutationCallback,
	options: MutationObserverInit = { attributes: true, childList: true, subtree: true },
): MutationObserverControls {
	const [observing, setObserving] = createSignal(false);
	let el: Element | undefined;
	let mo: MutationObserver | undefined;

	createEffect(() => {
		el = target();
		if (!el || typeof MutationObserver === "undefined") return;
		mo = new MutationObserver(callback);
		mo.observe(el, options);
		setObserving(true);
		onCleanup(() => {
			mo?.disconnect();
			mo = undefined;
			el = undefined;
			setObserving(false);
		});
	});

	return {
		observing,
		pause: () => {
			mo?.disconnect();
			setObserving(false);
		},
		resume: () => {
			if (el && mo && !observing()) {
				mo.observe(el, options);
				setObserving(true);
			}
		},
		takeRecords: () => mo?.takeRecords() ?? [],
	};
}
