import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface UseDevicePixelRatioOptions {
	/** Value used before the first measurement (also the SSR default). @default 1 (or the live `devicePixelRatio`) */
	initialValue?: number;
}

export interface DevicePixelRatioState {
	/** Current device pixel ratio — updates when the display DPR changes. */
	pixelRatio: Accessor<number>;
}

/**
 * Reactive `window.devicePixelRatio`. Because `devicePixelRatio` has no change
 * event, a `(resolution: N dppx)` media query is watched; when it fires (e.g.
 * the window moves to a HiDPI screen) the ratio is re-read and a fresh query is
 * installed for the new value. SSR-safe: `pixelRatio()` reports the initial
 * value and no listener is attached.
 *
 * @param options — See {@link UseDevicePixelRatioOptions}
 * @returns `{ pixelRatio }`
 *
 * @example
 * const { pixelRatio } = useDevicePixelRatio();
 * <span>{pixelRatio()}x</span>
 */
export function useDevicePixelRatio(options?: UseDevicePixelRatioOptions): DevicePixelRatioState {
	const initial = options?.initialValue ?? (typeof window !== "undefined" ? window.devicePixelRatio : 1);
	const [pixelRatio, setPixelRatio] = createSignal(initial);

	onMount(() => {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
		let mql: MediaQueryList;
		let onChange = () => {};

		onChange = () => {
			const dpr = window.devicePixelRatio;
			setPixelRatio(dpr);
			mql.removeEventListener("change", onChange);
			mql = window.matchMedia(`(resolution: ${dpr}dppx)`);
			mql.addEventListener("change", onChange);
		};

		mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
		mql.addEventListener("change", onChange);
		onCleanup(() => mql.removeEventListener("change", onChange));
	});

	return { pixelRatio };
}
