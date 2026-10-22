import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface LongPressOptions {
	/** Hold duration in ms before the press counts as a long press. @default 500 */
	ms?: number;
	/** Movement tolerance in px — releasing beyond it cancels the press. @default 10 */
	tolerance?: number;
}

export interface LongPressState {
	/** True while the pointer is held down on the element */
	pressing: Accessor<boolean>;
	/** Register a callback fired when the press starts (pointerdown) */
	onStart: (cb: (e: PointerEvent) => void) => void;
	/** Register a callback fired once the hold exceeds `ms` */
	onLongPress: (cb: (e: PointerEvent) => void) => void;
}

/**
 * Detect press-and-hold on an element — `pressing` tracks the hold and
 * `onLongPress` callbacks fire after `ms`. Rebinds when the target changes.
 * SSR-safe: no-ops without an element.
 *
 * @param target — Element or accessor resolving to one
 * @param options — See {@link LongPressOptions}
 * @returns `{ pressing, onStart, onLongPress }`
 *
 * @example
 * let pad!: HTMLDivElement;
 * const lp = useLongPress(() => pad, { ms: 600 });
 * lp.onLongPress(() => setDone(true));
 * <div ref={pad}>{lp.pressing() ? "holding…" : "hold me"}</div>
 */
export function useLongPress(
	target: MaybeAccessor<HTMLElement | undefined>,
	options: LongPressOptions = {},
): LongPressState {
	const { ms = 500, tolerance = 10 } = options;
	const [pressing, setPressing] = createSignal(false);
	const startCbs = new Set<(e: PointerEvent) => void>();
	const longPressCbs = new Set<(e: PointerEvent) => void>();

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let timer: ReturnType<typeof setTimeout> | undefined;
		let startX = 0;
		let startY = 0;
		let startEvent: PointerEvent | undefined;

		const cancel = () => {
			clearTimeout(timer);
			timer = undefined;
			setPressing(false);
		};

		const onDown = (e: PointerEvent) => {
			if (e.button !== 0 && e.pointerType === "mouse") return;
			startX = e.clientX;
			startY = e.clientY;
			startEvent = e;
			setPressing(true);
			for (const cb of startCbs) cb(e);
			clearTimeout(timer);
			timer = setTimeout(() => {
				timer = undefined;
				if (startEvent) for (const cb of longPressCbs) cb(startEvent);
			}, ms);
		};

		const onMove = (e: PointerEvent) => {
			if (!pressing()) return;
			if (Math.abs(e.clientX - startX) > tolerance || Math.abs(e.clientY - startY) > tolerance) cancel();
		};

		el.addEventListener("pointerdown", onDown);
		el.addEventListener("pointermove", onMove, { passive: true });
		el.addEventListener("pointerup", cancel);
		el.addEventListener("pointercancel", cancel);
		el.addEventListener("pointerleave", cancel);
		onCleanup(() => {
			clearTimeout(timer);
			setPressing(false);
			el.removeEventListener("pointerdown", onDown);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerup", cancel);
			el.removeEventListener("pointercancel", cancel);
			el.removeEventListener("pointerleave", cancel);
		});
	});

	return {
		pressing,
		onStart: (cb) => startCbs.add(cb),
		onLongPress: (cb) => longPressCbs.add(cb),
	};
}
