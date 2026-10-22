import { type Accessor, createSignal } from "solid-js";
import { createSensorLifecycle, type SensorLike } from "./sensor-lifecycle";

interface GyroscopeLike extends SensorLike {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;
}

export interface GyroscopeState {
	/** Latest rotation around the z axis in degrees — `null` until the first `reading` */
	alpha: Accessor<number | null>;
	/** Latest rotation around the x axis in degrees */
	beta: Accessor<number | null>;
	/** Latest rotation around the y axis in degrees */
	gamma: Accessor<number | null>;
	/** Whether the Gyroscope API exists */
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
 * Generic Sensor `Gyroscope` as signals — starts on mount and pushes
 * `alpha`/`beta`/`gamma` (degrees of rotation per axis) on every `reading`
 * event. `stop()` / `start()` control the sensor manually; it is always
 * stopped on cleanup. Degrades to `supported: false` + `null` values where
 * the API is missing — never throws. Requires the `gyroscope`
 * Permissions-Policy where enforced.
 *
 * @param options — `{ frequency }` caps the sampling rate in Hz
 * @returns `{ alpha, beta, gamma, supported, active, error, start, stop }`
 *
 * @example
 * const gyro = useGyroscope({ frequency: 30 });
 * <span>{gyro.alpha()?.toFixed(1) ?? "—"}°</span>
 */
export function useGyroscope(options?: { frequency?: number }): GyroscopeState {
	const [alpha, setAlpha] = createSignal<number | null>(null);
	const [beta, setBeta] = createSignal<number | null>(null);
	const [gamma, setGamma] = createSignal<number | null>(null);
	const { supported, active, error, start, stop } = createSensorLifecycle<GyroscopeLike>({
		ctorName: "Gyroscope",
		frequency: options?.frequency,
		errorLabel: "gyroscope",
		onReading: (s) => {
			setAlpha(s.alpha);
			setBeta(s.beta);
			setGamma(s.gamma);
		},
	});

	return { alpha, beta, gamma, supported, active, error, start, stop };
}
