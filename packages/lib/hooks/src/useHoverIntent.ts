import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface HoverIntentState {
	/** Attach to the element to track */
	ref: (el: HTMLElement) => void;
	/** True while the pointer is over the element (immediate) */
	hovering: Accessor<boolean>;
	/**
	 * True once the pointer has stayed within `sensitivity` px of its rest
	 * point for `delayMs` — the "intent to hover" signal
	 */
	intent: Accessor<boolean>;
}

/**
 * Distinguish deliberate hovers from fly-bys — `hovering` tracks the raw
 * pointer position while `intent` only flips true after the pointer rests
 * within `sensitivity` px for `delayMs`. Moving faster than the sensitivity
 * radius re-arms the delay, and leaving cancels a pending intent outright.
 *
 * @param options — `delayMs` rest time before `intent` fires; `sensitivity`
 * drift radius in px. @default delayMs 300, sensitivity 7
 * @returns `{ ref, hovering, intent }` — attach `ref` to the element
 *
 * @example
 * const { ref, intent } = useHoverIntent({ delayMs: 200 });
 * <div ref={ref}>{intent() ? <Tooltip /> : null}</div>
 */
export function useHoverIntent(options?: {
	/** Rest duration in ms before `intent` fires. @default 300 */
	delayMs?: number;
	/** Allowed pointer drift in px while resting — larger moves re-arm the delay. @default 7 */
	sensitivity?: number;
}): HoverIntentState {
	const delay = options?.delayMs ?? 300;
	const sensitivity = options?.sensitivity ?? 7;
	const [el, setEl] = createSignal<HTMLElement>();
	const [hovering, setHovering] = createSignal(false);
	const [intent, setIntent] = createSignal(false);

	createEffect(() => {
		const target = el();
		if (!target) return;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let restX = 0;
		let restY = 0;
		let resting = false;

		const arm = () => {
			clearTimeout(timer);
			timer = setTimeout(() => setIntent(true), delay);
		};
		const enter = (e: PointerEvent) => {
			setHovering(true);
			resting = true;
			restX = e.clientX;
			restY = e.clientY;
			arm();
		};
		const move = (e: PointerEvent) => {
			if (!resting || intent()) return;
			if (Math.hypot(e.clientX - restX, e.clientY - restY) > sensitivity) {
				restX = e.clientX;
				restY = e.clientY;
				arm();
			}
		};
		const leave = () => {
			clearTimeout(timer);
			resting = false;
			setHovering(false);
			setIntent(false);
		};

		target.addEventListener("pointerenter", enter);
		target.addEventListener("pointermove", move);
		target.addEventListener("pointerleave", leave);
		onCleanup(() => {
			clearTimeout(timer);
			target.removeEventListener("pointerenter", enter);
			target.removeEventListener("pointermove", move);
			target.removeEventListener("pointerleave", leave);
			setHovering(false);
			setIntent(false);
		});
	});

	return { ref: setEl, hovering, intent };
}
