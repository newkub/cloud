import { type Accessor, createSignal } from "solid-js";
import { createSensorLifecycle, type SensorLike } from "./sensor-lifecycle";

interface MagnetometerLike extends SensorLike {
	x: number | null;
	y: number | null;
	z: number | null;
}

export interface MagnetometerState {
	/** Latest magnetic field along the x axis in μT — `null` until the first `reading` */
	x: Accessor<number | null>;
	/** Latest magnetic field along the y axis in μT */
	y: Accessor<number | null>;
	/** Latest magnetic field along the z axis in μT */
	z: Accessor<number | null>;
	/** Whether the Magnetometer API exists */
	supported: boolean;
	/** True while the sensor is running */
	active: Accessor<boolean>;
	/** Last sensor error message (permission denied, insecure context, …) */
	error: Accessor<string | undefined>;
	/** (Re)start the sensor — no-op while running or when unsupported */
	start: () => void;
	/** Stop the sensor and detach its listeners */
	stop: () => void;
}

/**
 * Generic Sensor `Magnetometer` as signals — starts on mount and pushes
 * `x`/`y`/`z` (microtesla) on every `reading` event. `stop()` / `start()`
 * control the sensor manually; it is always stopped on cleanup. Degrades to
 * `supported: false` + `null` axes where the API is missing — never throws.
 * Requires the `magnetometer` Permissions-Policy where enforced.
 *
 * @param options — `{ frequency }` caps the sampling rate in Hz
 * @returns `{ x, y, z, supported, active, error, start, stop }`
 *
 * @example
 * const mag = useMagnetometer();
 * const heading = () => Math.atan2(mag.y() ?? 0, mag.x() ?? 0) * (180 / Math.PI);
 */
export function useMagnetometer(options?: { frequency?: number }): MagnetometerState {
	const [x, setX] = createSignal<number | null>(null);
	const [y, setY] = createSignal<number | null>(null);
	const [z, setZ] = createSignal<number | null>(null);
	const { supported, active, error, start, stop } = createSensorLifecycle<MagnetometerLike>({
		ctorName: "Magnetometer",
		frequency: options?.frequency,
		errorLabel: "magnetometer",
		onReading: (s) => {
			setX(s.x);
			setY(s.y);
			setZ(s.z);
		},
	});

	return { x, y, z, supported, active, error, start, stop };
}
