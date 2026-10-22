import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface DeviceMotionAcceleration {
	/** Acceleration along the x axis in m/s² */
	x: number | null;
	/** Acceleration along the y axis in m/s² */
	y: number | null;
	/** Acceleration along the z axis in m/s² */
	z: number | null;
}

export interface DeviceMotionRotationRate {
	/** Rotation rate around the z axis in °/s */
	alpha: number | null;
	/** Rotation rate around the x axis in °/s */
	beta: number | null;
	/** Rotation rate around the y axis in °/s */
	gamma: number | null;
}

export interface DeviceMotionState {
	/** Linear acceleration `{ x, y, z }` in m/s² — `null` until the first event */
	acceleration: Accessor<DeviceMotionAcceleration | null>;
	/** Rotation rate `{ alpha, beta, gamma }` in °/s — `null` until the first event */
	rotationRate: Accessor<DeviceMotionRotationRate | null>;
	/** Sampling interval in ms reported by the device */
	interval: Accessor<number | null>;
	/** Whether the `devicemotion` event exists */
	supported: boolean;
}

/**
 * `devicemotion` events as signals — tracks linear acceleration, rotation
 * rate and the device-reported sampling interval. All accessors stay `null`
 * until the first event fires; `supported` is `false` on browsers without
 * `DeviceMotionEvent` and on SSR. The listener is removed on cleanup.
 *
 * Note: iOS 13+ requires `DeviceMotionEvent.requestPermission()` from a user
 * gesture — call it yourself before relying on readings.
 *
 * @returns `{ acceleration, rotationRate, interval, supported }`
 *
 * @example
 * const motion = useDeviceMotion();
 * <span>{motion.acceleration()?.x?.toFixed(1) ?? "—"} m/s²</span>
 */
export function useDeviceMotion(): DeviceMotionState {
	const [acceleration, setAcceleration] = createSignal<DeviceMotionAcceleration | null>(null);
	const [rotationRate, setRotationRate] = createSignal<DeviceMotionRotationRate | null>(null);
	const [interval, setInterval] = createSignal<number | null>(null);
	const supported = typeof window !== "undefined" && "DeviceMotionEvent" in window;

	onMount(() => {
		if (!supported) return;
		const onMotion = (e: DeviceMotionEvent) => {
			setAcceleration(e.acceleration ?? null);
			setRotationRate(e.rotationRate ?? null);
			setInterval(typeof e.interval === "number" ? e.interval : null);
		};
		window.addEventListener("devicemotion", onMotion);
		onCleanup(() => window.removeEventListener("devicemotion", onMotion));
	});

	return { acceleration, rotationRate, interval, supported };
}
