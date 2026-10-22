import { type Accessor, createEffect, createSignal, untrack } from "solid-js";

export interface RenderCountControls {
	/** Number of updates observed — starts at 1 for the initial render */
	count: Accessor<number>;
}

/**
 * Counts updates for debugging — `count` starts at 1 (the initial render) and
 * increments each time `track` re-fires, without re-triggering itself (the
 * write is `untracked`). Pass the signal your component renders to count its
 * reactive updates; omit it to count just the mount. `name` logs
 * `[name] render #n` to the console.
 *
 * @param name — Optional label echoed to `console.debug` on each update
 * @param track — Optional accessor whose changes count as renders
 * @returns `{ count }`
 *
 * @example
 * const [value, setValue] = createSignal(0);
 * const renders = useRenderCount("counter", value);
 * <span>{renders.count()} renders</span>
 */
export function useRenderCount(name?: string, track?: Accessor<unknown>): RenderCountControls {
	const [count, setCount] = createSignal(0);

	createEffect(() => {
		track?.();
		untrack(() => {
			setCount((c) => c + 1);
			if (name && typeof console !== "undefined") console.debug(`[${name}] render #${count()}`);
		});
	});

	return { count };
}
