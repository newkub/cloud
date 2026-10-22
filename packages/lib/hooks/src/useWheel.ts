import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface WheelDelta {
	/** Accumulated horizontal wheel delta in px */
	dx: number;
	/** Accumulated vertical wheel delta in px */
	dy: number;
}

/**
 * Accumulated wheel deltas on an element. Raw accumulation by default — pass
 * `resetMs` to decay back to zero after that much wheel inactivity. Passive
 * listener; SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — `resetMs` clears the accumulation after inactivity
 * @returns Accessor for `{ dx, dy }`
 *
 * @example
 * let pad!: HTMLDivElement;
 * const wheel = useWheel(() => pad, { resetMs: 400 });
 * <div ref={pad}>{wheel().dy.toFixed(0)}px scrolled</div>
 */
export function useWheel(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: {
		/** Reset `{ dx, dy }` to zero after this many ms without wheel events. */
		resetMs?: number;
	},
): Accessor<WheelDelta> {
	const [state, setState] = createSignal<WheelDelta>({ dx: 0, dy: 0 });

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let timer: ReturnType<typeof setTimeout> | undefined;

		const onWheel = (e: WheelEvent) => {
			setState((s) => ({ dx: s.dx + e.deltaX, dy: s.dy + e.deltaY }));
			if (options?.resetMs) {
				clearTimeout(timer);
				timer = setTimeout(() => setState({ dx: 0, dy: 0 }), options.resetMs);
			}
		};

		el.addEventListener("wheel", onWheel, { passive: true });
		onCleanup(() => {
			clearTimeout(timer);
			el.removeEventListener("wheel", onWheel);
		});
	});

	return state;
}
