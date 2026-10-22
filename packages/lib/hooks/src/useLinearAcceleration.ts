import { type Accessor, createSignal } from "solid-js";
import { createSensorLifecycle, type SensorLike } from "./sensor-lifecycle";

interface LinearAccelerationSensorLike extends SensorLike {
	x: number | null;
	y: number | null;
	z: number | null;
}

export interface LinearAccelerationState {
	/** Latest linear acceleration along the x axis in m/s² — `null` until the first `reading` */
	x: Accessor<number | null>;
	/** Latest linear acceleration along the y axis in m/s² */
	y: Accessor<number | null>;
	/** Latest linear acceleration along the z axis in m/s² */
	z: Accessor<number | null>;
	/** Whether the LinearAccelerationSensor API exists */
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
 * Generic Sensor `LinearAccelerationSensor` as signals — like
 * `useAccelerometer` but with gravity already removed. Starts on mount and
 * pushes `x`/`y`/`z` (m/s²) on every `reading` event; `stop()` / `start()`
 * control the sensor manually and it is always stopped on cleanup. Degrades
 * to `supported: false` + `null` axes where the API is missing — never
 * throws. Requires the `accelerometer` Permissions-Policy where enforced.
 *
 * @param options — `{ frequency }` caps the sampling rate in Hz
 * @returns `{ x, y, z, supported, active, error, start, stop }`
 *
 * @example
 * const lin = useLinearAcceleration({ frequency: 60 });
 * <span>{lin.z()?.toFixed(2) ?? "—"} m/s²</span>
 */
export function useLinearAcceleration(options?: { frequency?: number }): LinearAccelerationState {
	const [x, setX] = createSignal<number | null>(null);
	const [y, setY] = createSignal<number | null>(null);
	const [z, setZ] = createSignal<number | null>(null);
	const { supported, active, error, start, stop } = createSensorLifecycle<LinearAccelerationSensorLike>({
		ctorName: "LinearAccelerationSensor",
		frequency: options?.frequency,
		errorLabel: "linear acceleration sensor",
		onReading: (s) => {
			setX(s.x);
			setY(s.y);
			setZ(s.z);
		},
	});

	return { x, y, z, supported, active, error, start, stop };
}
