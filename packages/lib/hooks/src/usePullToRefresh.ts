import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface PullToRefreshOptions {
	/** Async refresh — runs when the pull passes `threshold`. */
	onRefresh: () => Promise<unknown> | unknown;
	/** Pull distance in px needed to trigger `onRefresh`. @default 80 */
	threshold?: number;
	/** Gate the gesture — while truthy pulls are ignored. @default false */
	disabled?: MaybeAccessor<boolean>;
}

export interface PullToRefreshState {
	/** True while a downward pull is being tracked at scroll-top */
	pulling: Accessor<boolean>;
	/** Pull distance / threshold, clamped to `0 .. 1` — 1 means "release to refresh" */
	progress: Accessor<number>;
	/** True while `onRefresh` is in flight */
	refreshing: Accessor<boolean>;
}

/**
 * Pull-to-refresh gesture for a scrollable container — tracks a single-finger
 * downward touch while the element is scrolled to the top. `progress()` maps
 * the pull distance to `0 .. 1`; releasing past `1` runs `onRefresh` and holds
 * `refreshing()` until it settles. Passive listeners; SSR-safe.
 *
 * @param ref — Scrollable element or accessor resolving to one
 * @param options — `onRefresh`, plus `threshold`/`disabled`
 * @returns `{ pulling, progress, refreshing }`
 *
 * @example
 * const ptr = usePullToRefresh(() => listEl, { threshold: 72, onRefresh: reload });
 * <div ref={listEl} class="overflow-y-auto">
 *   <Show when={ptr.pulling() || ptr.refreshing()}>
 *     <Spinner style={{ opacity: ptr.refreshing() ? 1 : ptr.progress() }} />
 *   </Show>
 * </div>
 */
export function usePullToRefresh(
	ref: MaybeAccessor<HTMLElement | undefined>,
	options: PullToRefreshOptions,
): PullToRefreshState {
	const threshold = Math.max(1, options.threshold ?? 80);
	const [pulling, setPulling] = createSignal(false);
	const [progress, setProgress] = createSignal(0);
	const [refreshing, setRefreshing] = createSignal(false);

	createEffect(() => {
		const el = read(ref);
		if (!el || typeof window === "undefined") return;

		let startY = 0;
		let tracking = false;
		let distance = 0;

		const onStart = (e: TouchEvent) => {
			const t = e.touches[0];
			if (!t || el.scrollTop > 0 || refreshing() || read(options.disabled ?? false)) return;
			startY = t.clientY;
			tracking = true;
		};

		const onMove = (e: TouchEvent) => {
			if (!tracking) return;
			const t = e.touches[0];
			if (!t) return;
			distance = Math.max(0, t.clientY - startY);
			if (distance === 0) {
				setPulling(false);
				setProgress(0);
				return;
			}
			setPulling(true);
			setProgress(Math.min(1, distance / threshold));
		};

		const onEnd = () => {
			if (!tracking) return;
			tracking = false;
			const fire = pulling() && distance >= threshold;
			setPulling(false);
			setProgress(0);
			distance = 0;
			if (!fire) return;
			setRefreshing(true);
			Promise.resolve(options.onRefresh()).finally(() => setRefreshing(false));
		};

		el.addEventListener("touchstart", onStart, { passive: true });
		el.addEventListener("touchmove", onMove, { passive: true });
		el.addEventListener("touchend", onEnd, { passive: true });
		el.addEventListener("touchcancel", onEnd, { passive: true });
		onCleanup(() => {
			el.removeEventListener("touchstart", onStart);
			el.removeEventListener("touchmove", onMove);
			el.removeEventListener("touchend", onEnd);
			el.removeEventListener("touchcancel", onEnd);
		});
	});

	return { pulling, progress, refreshing };
}
