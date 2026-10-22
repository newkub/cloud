import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PointerPressureState {
	/** Normalized pressure 0–1 (0.5 for a plain mouse click, up to 1 for pen presses) */
	pressure: Accessor<number>;
	/** True while any pointer button is held */
	active: Accessor<boolean>;
	/** Whether `PointerEvent` exists */
	supported: boolean;
}

/**
 * Pointer pressure as signals — listens for `pointermove`/`pointerdown`/
 * `pointerup`/`pointercancel` on `window` and mirrors `event.pressure` plus an
 * `active()` flag derived from `event.buttons`. Useful for pen/stylus-aware
 * drawing UIs. Pressure resets to `0` on pointerup/cancel. Listeners are
 * removed on cleanup; SSR-safe (`supported` is `false` without `PointerEvent`).
 *
 * @returns `{ pressure, active, supported }`
 *
 * @example
 * const pp = usePointerPressure();
 * <div style={{ opacity: 0.3 + pp.pressure() * 0.7 }}>press harder</div>
 */
export function usePointerPressure(): PointerPressureState {
	const [pressure, setPressure] = createSignal(0);
	const [active, setActive] = createSignal(false);
	const supported = typeof window !== "undefined" && "PointerEvent" in window;

	onMount(() => {
		const read = (e: Event) => {
			const p = e as PointerEvent;
			if (typeof p.pressure === "number") setPressure(p.pressure);
			setActive(typeof p.buttons === "number" ? p.buttons > 0 : (p.pressure ?? 0) > 0);
		};
		const release = () => {
			setActive(false);
			setPressure(0);
		};
		window.addEventListener("pointermove", read);
		window.addEventListener("pointerdown", read);
		window.addEventListener("pointerup", release);
		window.addEventListener("pointercancel", release);
		onCleanup(() => {
			window.removeEventListener("pointermove", read);
			window.removeEventListener("pointerdown", read);
			window.removeEventListener("pointerup", release);
			window.removeEventListener("pointercancel", release);
		});
	});

	return { pressure, active, supported };
}
