import { type Accessor, createEffect, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";
import { useIntersection } from "./useIntersection";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface InfiniteScrollOptions {
	/**
	 * Load the next page — called each time the sentinel scrolls into view.
	 * Return (or resolve) `false` to signal there is nothing left — this
	 * latches `done()` and stops further calls.
	 */
	loadMore: () => boolean | undefined | Promise<boolean | undefined>;
	/** IntersectionObserver rootMargin — grow it to prefetch before the sentinel is visible. @default "0px" */
	rootMargin?: string;
	/** Gate loading — while truthy the sentinel is ignored. @default false */
	disabled?: MaybeAccessor<boolean>;
	/** Extra IntersectionObserver thresholds forwarded to the observer. */
	threshold?: number | number[];
}

export interface InfiniteScrollState {
	/** Attach to the sentinel element at the end of the list */
	sentinelRef: (el: HTMLElement) => void;
	/** True while `loadMore` is in flight */
	loading: Accessor<boolean>;
	/** Latched true once `loadMore` returns `false` — cleared by `reset()` */
	done: Accessor<boolean>;
	/** Clear `done`/`loading` so the sentinel can load again */
	reset: () => void;
}

/**
 * Infinite scroll via an IntersectionObserver sentinel — attach
 * `sentinelRef` after the list; each time it enters the viewport
 * `options.loadMore()` runs (once at a time — re-triggers are swallowed
 * while `loading()`). `loadMore` may return `false` to latch `done()`.
 *
 * @param options — `loadMore`, plus `rootMargin`/`disabled`/`threshold`
 * @returns `{ sentinelRef, loading, done, reset }`
 *
 * @example
 * const feed = useInfiniteScroll({ loadMore: () => api.nextPage(), rootMargin: "200px" });
 * <For each={items()}>{(i) => <Row item={i} />}</For>
 * <div ref={feed.sentinelRef} />
 * <Show when={feed.loading()}><Spinner /></Show>
 */
export function useInfiniteScroll(options: InfiniteScrollOptions): InfiniteScrollState {
	const [loading, setLoading] = createSignal(false);
	const [done, setDone] = createSignal(false);
	const { ref: sentinelRef, visible } = useIntersection({
		rootMargin: options.rootMargin,
		threshold: options.threshold,
	});
	// Fire once per intersection edge — without this, `loading`/`done` writes
	// would re-run the effect and re-trigger while the sentinel stays visible.
	let wasVisible = false;

	const trigger = () => {
		setLoading(true);
		Promise.resolve(options.loadMore())
			.then((more) => {
				if (more === false) setDone(true);
			})
			.finally(() => setLoading(false));
	};

	createEffect(() => {
		const v = visible();
		const fire = v && !wasVisible && !loading() && !done() && !read(options.disabled ?? false);
		wasVisible = v;
		if (fire) trigger();
	});

	return {
		sentinelRef,
		loading,
		done,
		reset: () => {
			wasVisible = false;
			setDone(false);
			setLoading(false);
		},
	};
}
