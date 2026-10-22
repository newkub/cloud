import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PrintControls {
	/** True between `beforeprint` and `afterprint` */
	printing: Accessor<boolean>;
	/** Register a `beforeprint` callback (e.g. expand collapsed sections) */
	onBefore: (cb: () => void) => void;
	/** Register an `afterprint` callback (e.g. restore the UI) */
	onAfter: (cb: () => void) => void;
	/** Trigger `window.print()` */
	print: () => void;
}

/**
 * Track the print lifecycle — `beforeprint`/`afterprint` flip `printing` and
 * run registered callbacks. SSR-safe; listeners bind on mount.
 *
 * @returns `{ printing, onBefore, onAfter, print }` controls
 *
 * @example
 * const p = usePrint();
 * p.onBefore(() => expandAll());
 * <button onClick={p.print}>Print</button>
 */
export function usePrint(): PrintControls {
	const [printing, setPrinting] = createSignal(false);
	const before = new Set<() => void>();
	const after = new Set<() => void>();

	onMount(() => {
		const onBefore = () => {
			setPrinting(true);
			for (const cb of before) cb();
		};
		const onAfter = () => {
			setPrinting(false);
			for (const cb of after) cb();
		};
		window.addEventListener("beforeprint", onBefore);
		window.addEventListener("afterprint", onAfter);
		onCleanup(() => {
			window.removeEventListener("beforeprint", onBefore);
			window.removeEventListener("afterprint", onAfter);
			before.clear();
			after.clear();
		});
	});

	return {
		printing,
		onBefore: (cb) => before.add(cb),
		onAfter: (cb) => after.add(cb),
		print: () => window.print(),
	};
}
