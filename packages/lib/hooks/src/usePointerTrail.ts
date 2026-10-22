import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface TrailPoint {
	/** `clientX` at sample time */
	x: number;
	/** `clientY` at sample time */
	y: number;
	/** `Date.now()` timestamp */
	t: number;
}

export interface PointerTrailState {
	/** Recent points, oldest → newest, capped at `max` */
	trail: Accessor<TrailPoint[]>;
	/** Drop all recorded points */
	clear: () => void;
}

/**
 * Record a capped trail of pointer positions — each `pointermove` appends
 * `{ x, y, t }`, throttled to at most one sample per `throttleMs`, with the
 * buffer trimmed to the newest `max` points. Listens on `target` or window;
 * SSR-safe.
 *
 * @param target — Element/accessor to track (defaults to window)
 * @param options — `max` points kept; `throttleMs` minimum gap between samples. @default max 100, throttleMs 16
 * @returns `{ trail, clear }`
 *
 * @example
 * const { trail } = usePointerTrail(() => canvas(), { max: 32 });
 * <For each={trail()}>{(p) => <Dot x={p.x} y={p.y} />}</For>
 */
export function usePointerTrail(
	target?: MaybeAccessor<HTMLElement | Window | undefined>,
	options?: {
		/** Maximum points retained. @default 100 */
		max?: number;
		/** Minimum ms between samples. @default 16 */
		throttleMs?: number;
	},
): PointerTrailState {
	const max = options?.max ?? 100;
	const throttleMs = options?.throttleMs ?? 16;
	const [trail, setTrail] = createSignal<TrailPoint[]>([]);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = target === undefined ? window : read(target);
		if (!el) return;
		let last = Number.NEGATIVE_INFINITY;

		const onMove = (e: PointerEvent) => {
			const now = Date.now();
			if (now - last < throttleMs) return;
			last = now;
			setTrail((prev) => {
				const next = prev.length >= max ? prev.slice(prev.length - max + 1) : prev;
				return [...next, { x: e.clientX, y: e.clientY, t: now }];
			});
		};

		el.addEventListener("pointermove", onMove as EventListener, { passive: true });
		onCleanup(() => {
			el.removeEventListener("pointermove", onMove as EventListener);
			setTrail([]);
		});
	});

	return { trail, clear: () => setTrail([]) };
}
