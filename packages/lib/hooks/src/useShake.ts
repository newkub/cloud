import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

interface AccelerometerLike extends EventTarget {
	x: number | null;
	y: number | null;
	z: number | null;
	start: () => void;
	stop: () => void;
}

type AccelerometerCtor = new (options?: { frequency?: number }) => AccelerometerLike;

export interface ShakeState {
	/** Total shakes detected since mount */
	shakeCount: Accessor<number>;
	/** Timestamp (`Date.now()`) of the last detected shake — `undefined` until one fires */
	lastShakeAt: Accessor<number | undefined>;
	/** Whether the Accelerometer API exists */
	supported: boolean;
	/** True while the sensor is running */
	active: Accessor<boolean>;
	/** Last sensor error message */
	error: Accessor<string | undefined>;
	/** (Re)start detection — no-op while running or when unsupported */
	start: () => void;
	/** Stop detection and detach the sensor */
	stop: () => void;
}

/**
 * Shake detection derived from the Generic Sensor `Accelerometer` — a
 * `reading` whose acceleration magnitude `√(x²+y²+z²)` exceeds `threshold`
 * counts as a shake, subject to a `cooldownMs` refractory period between
 * counts. The sensor starts on mount and stops on cleanup; `onShake` fires
 * with the new count on every detection. Degrades to `supported: false`
 * where the API is missing — never throws.
 *
 * @param options — `threshold` in m/s² @default 15 — `cooldownMs` minimum gap between shakes @default 1000 — `frequency` sensor rate cap in Hz — `onShake` callback receiving the new count
 * @returns `{ shakeCount, lastShakeAt, supported, active, error, start, stop }`
 *
 * @example
 * const shake = useShake({ onShake: (n) => toast(`shaken ×${n}`) });
 * <span>{shake.shakeCount()} shakes</span>
 */
export function useShake(options?: {
	/** Acceleration magnitude (m/s²) that counts as a shake. @default 15 */
	threshold?: number;
	/** Minimum milliseconds between counted shakes. @default 1000 */
	cooldownMs?: number;
	/** Sensor sampling-rate cap in Hz. */
	frequency?: number;
	/** Called with the new count on every detected shake. */
	onShake?: (count: number) => void;
}): ShakeState {
	const [shakeCount, setShakeCount] = createSignal(0);
	const [lastShakeAt, setLastShakeAt] = createSignal<number>();
	const [error, setError] = createSignal<string>();
	const [active, setActive] = createSignal(false);
	const supported = typeof window !== "undefined" && "Accelerometer" in window;
	let sensor: AccelerometerLike | undefined;
	let last = 0;

	const onReading = () => {
		if (!sensor) return;
		const { x, y, z } = sensor;
		if (x === null || y === null || z === null) return;
		const magnitude = Math.sqrt(x * x + y * y + z * z);
		const now = Date.now();
		if (magnitude < (options?.threshold ?? 15)) return;
		if (now - last < (options?.cooldownMs ?? 1000)) return;
		last = now;
		setLastShakeAt(now);
		setShakeCount((n) => {
			const next = n + 1;
			options?.onShake?.(next);
			return next;
		});
	};
	const onError = (e: Event) => {
		const err = (e as { error?: DOMException }).error;
		setError(err?.message ?? "accelerometer error");
	};

	const start = () => {
		if (sensor) return;
		const Ctor = supported ? (window as { Accelerometer?: AccelerometerCtor }).Accelerometer : undefined;
		if (!Ctor) return;
		let next: AccelerometerLike;
		try {
			next = new Ctor(options?.frequency ? { frequency: options.frequency } : undefined);
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

	return { shakeCount, lastShakeAt, supported, active, error, start, stop };
}
