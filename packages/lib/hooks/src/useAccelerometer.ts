import { type Accessor, createSignal } from "solid-js";
import { createSensorLifecycle, type SensorLike } from "./sensor-lifecycle";

interface AccelerometerLike extends SensorLike {
	x: number | null;
	y: number | null;
	z: number | null;
}

export interface AccelerometerState {
	/** Latest acceleration along the x axis in m/s² — `null` until the first `reading` */
	x: Accessor<number | null>;
	/** Latest acceleration along the y axis in m/s² */
	y: Accessor<number | null>;
	/** Latest acceleration along the z axis in m/s² */
	z: Accessor<number | null>;
	/** Whether the Accelerometer API exists */
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
 * Generic Sensor `Accelerometer` as signals — starts on mount and pushes
 * `x`/`y`/`z` (m/s², gravity included) on every `reading` event. `stop()` /
 * `start()` control the sensor manually; it is always stopped on cleanup.
 * Degrades to `supported: false` + `null` axes where the API is missing —
 * never throws. Requires the `accelerometer` Permissions-Policy where
 * enforced.
 *
 * @param options — `{ frequency }` caps the sampling rate in Hz
 * @returns `{ x, y, z, supported, active, error, start, stop }`
 *
 * @example
 * const accel = useAccelerometer({ frequency: 30 });
 * <span>{accel.x()?.toFixed(2) ?? "—"}</span>
 */
export function useAccelerometer(options?: { frequency?: number }): AccelerometerState {
	const [x, setX] = createSignal<number | null>(null);
	const [y, setY] = createSignal<number | null>(null);
	const [z, setZ] = createSignal<number | null>(null);
	const { supported, active, error, start, stop } = createSensorLifecycle<AccelerometerLike>({
		ctorName: "Accelerometer",
		frequency: options?.frequency,
		errorLabel: "accelerometer",
		onReading: (s) => {
			setX(s.x);
			setY(s.y);
			setZ(s.z);
		},
	});

	return { x, y, z, supported, active, error, start, stop };
}
