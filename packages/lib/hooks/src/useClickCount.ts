import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ClickCountState {
	/** Clicks inside the trailing `windowMs` window — decays back to 0 */
	count: Accessor<number>;
	/** Total clicks since mount — never resets */
	clicks: Accessor<number>;
}

/**
 * Count clicks on a target (window by default) — `count` reports clicks
 * within the last `windowMs` and decays as they age out, while `clicks` is
 * a running total for the hook's lifetime. Useful for double/triple-click
 * detection and click-rate UI.
 *
 * @param target — Element, accessor, or `Window`/`Document` (defaults to window)
 * @param options — `windowMs` sliding window size. @default 500
 * @returns `{ count, clicks }` accessors
 *
 * @example
 * const { count, clicks } = useClickCount(() => btn(), { windowMs: 400 });
 * <div>{count() >= 2 ? "double click!" : `${clicks()} total`}</div>
 */
export function useClickCount(
	target?: MaybeAccessor<HTMLElement | Window | Document | undefined>,
	options?: {
		/** Sliding window in ms that `count` measures. @default 500 */
		windowMs?: number;
	},
): ClickCountState {
	const windowMs = options?.windowMs ?? 500;
	const [count, setCount] = createSignal(0);
	const [clicks, setClicks] = createSignal(0);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = target === undefined ? window : read(target);
		if (!el) return;
		let stamps: number[] = [];
		let timer: ReturnType<typeof setTimeout> | undefined;

		const prune = () => {
			const cutoff = Date.now() - windowMs;
			stamps = stamps.filter((s) => s > cutoff);
			setCount(stamps.length);
		};
		// Arm for the oldest stamp's expiry so clicks age out one at a time.
		const arm = () => {
			clearTimeout(timer);
			timer = undefined;
			const oldest = stamps[0];
			if (oldest === undefined) return;
			timer = setTimeout(
				() => {
					prune();
					arm();
				},
				Math.max(oldest + windowMs + 1 - Date.now(), 0),
			);
		};
		const onClick = () => {
			stamps.push(Date.now());
			prune();
			setClicks((c) => c + 1);
			arm();
		};

		el.addEventListener("click", onClick);
		onCleanup(() => {
			clearTimeout(timer);
			stamps = [];
			setCount(0);
			el.removeEventListener("click", onClick);
		});
	});

	return { count, clicks };
}
