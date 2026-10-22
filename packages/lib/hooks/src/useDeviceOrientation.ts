import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface DeviceOrientationState {
	/** Rotation around the z axis, 0–360° — `null` until the first event */
	alpha: Accessor<number | null>;
	/** Front-to-back tilt, −180–180° */
	beta: Accessor<number | null>;
	/** Left-to-right tilt, −90–90° */
	gamma: Accessor<number | null>;
	/** Whether the `deviceorientation` event exists */
	supported: boolean;
}

/**
 * `deviceorientation` events as signals — `alpha`/`beta`/`gamma` stay `null`
 * until the first event fires; `supported` is `false` on browsers without
 * `DeviceOrientationEvent` and on SSR. The listener is removed on cleanup.
 *
 * Note: iOS 13+ requires `DeviceOrientationEvent.requestPermission()` from a
 * user gesture — call it yourself before relying on readings.
 *
 * @returns `{ alpha, beta, gamma, supported }`
 *
 * @example
 * const ori = useDeviceOrientation();
 * <div style={{ transform: `rotate(${ori.gamma() ?? 0}deg)` }} />
 */
export function useDeviceOrientation(): DeviceOrientationState {
	const [alpha, setAlpha] = createSignal<number | null>(null);
	const [beta, setBeta] = createSignal<number | null>(null);
	const [gamma, setGamma] = createSignal<number | null>(null);
	const supported = typeof window !== "undefined" && "DeviceOrientationEvent" in window;

	onMount(() => {
		if (!supported) return;
		const onOrientation = (e: DeviceOrientationEvent) => {
			setAlpha(e.alpha);
			setBeta(e.beta);
			setGamma(e.gamma);
		};
		window.addEventListener("deviceorientation", onOrientation);
		onCleanup(() => window.removeEventListener("deviceorientation", onOrientation));
	});

	return { alpha, beta, gamma, supported };
}
