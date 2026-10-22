import { type Accessor, createSignal } from "solid-js";
import { createSensorLifecycle, type SensorLike } from "./sensor-lifecycle";

interface AmbientLightSensorLike extends SensorLike {
	illuminance: number;
}

export interface AmbientLightState {
	/** Latest illuminance reading in lux — `null` until the first `reading` event */
	lux: Accessor<number | null>;
	/** Whether the AmbientLightSensor API exists */
	supported: boolean;
	/** Last sensor error message (permission denied, insecure context, …) */
	error: Accessor<string | undefined>;
}

/**
 * AmbientLightSensor as a signal — starts the sensor on mount and updates
 * `lux()` on every `reading` event. Stays `null` on browsers without the API
 * (Firefox, Safari) and on SSR — never throws. The sensor is stopped on
 * cleanup. Requires the `ambient-light-sensor` Permissions-Policy where
 * enforced.
 *
 * @param options — `{ frequency }` caps the sampling rate in Hz
 * @returns `{ lux, supported, error }`
 *
 * @example
 * const light = useAmbientLight();
 * <span>{light.lux() ?? "—"} lux</span>
 */
export function useAmbientLight(options?: { frequency?: number }): AmbientLightState {
	const [lux, setLux] = createSignal<number | null>(null);
	const { supported, error } = createSensorLifecycle<AmbientLightSensorLike>({
		ctorName: "AmbientLightSensor",
		frequency: options?.frequency,
		errorLabel: "ambient light sensor",
		onReading: (s) => setLux(s.illuminance),
	});

	return { lux, supported, error };
}
