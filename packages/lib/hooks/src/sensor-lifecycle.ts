import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/** Minimal shape shared by the Generic Sensor API (`Accelerometer`, `Gyroscope`, …) */
export interface SensorLike extends EventTarget {
	start(): void;
	stop(): void;
}

export type SensorCtor<S extends SensorLike> = new (options?: { frequency?: number }) => S;

export interface SensorLifecycle {
	/** Whether the sensor constructor exists on `window` */
	readonly supported: boolean;
	/** True while the sensor is running */
	readonly active: Accessor<boolean>;
	/** Last sensor error message */
	readonly error: Accessor<string | undefined>;
	/** (Re)start the sensor — no-op while running or when unsupported */
	readonly start: () => void;
	/** Stop the sensor and detach its listeners */
	readonly stop: () => void;
}

/**
 * Shared Generic Sensor lifecycle: constructs the sensor lazily, wires
 * `reading`/`error` listeners, auto-starts on mount when supported, and
 * always stops on cleanup. Never throws.
 */
export function createSensorLifecycle<S extends SensorLike>(options: {
	ctorName: string;
	frequency?: number;
	errorLabel: string;
	onReading: (sensor: S) => void;
}): SensorLifecycle {
	const [error, setError] = createSignal<string>();
	const [active, setActive] = createSignal(false);
	const supported = typeof window !== "undefined" && options.ctorName in window;
	let sensor: S | undefined;

	const onReading = () => {
		if (!sensor) return;
		options.onReading(sensor);
	};
	const onError = (e: Event) => {
		const err = (e as { error?: DOMException }).error;
		setError(err?.message ?? `${options.errorLabel} error`);
	};

	const start = () => {
		if (sensor) return;
		const Ctor = supported
			? (window as unknown as Record<string, SensorCtor<S> | undefined>)[options.ctorName]
			: undefined;
		if (!Ctor) return;
		let next: S;
		try {
			next = new Ctor(options.frequency ? { frequency: options.frequency } : undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			return;
		}
		sensor = next;
		next.addEventListener("reading", onReading);
		next.addEventListener("error", onError);
		try {
			next.start();
			setActive(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	const stop = () => {
		if (!sensor) return;
		const s = sensor;
		sensor = undefined;
		s.removeEventListener("reading", onReading);
		s.removeEventListener("error", onError);
		try {
			s.stop();
		} catch {
			/* already stopped */
		}
		setActive(false);
	};

	onMount(() => {
		if (supported) start();
	});
	onCleanup(stop);

	return { supported, active, error, start, stop };
}
