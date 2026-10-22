import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type CpuPressureLevel = "nominal" | "fair" | "serious" | "critical" | "unknown";

export interface CpuPressureRecordLike {
	readonly state: string;
	readonly time?: number;
	readonly source?: string;
}

interface PressureObserverLike {
	observe(source: string, options?: { sampleInterval?: number }): Promise<void> | void;
	unobserve?(source: string): void;
	disconnect(): void;
}

type PressureObserverCtor = new (
	callback: (records: readonly CpuPressureRecordLike[]) => void,
	options?: { sampleInterval?: number },
) => PressureObserverLike;

export interface CpuPressureState {
	/** `PressureObserver` support flag (Compute Pressure API) */
	supported: boolean;
	/**
	 * Latest reported pressure level — `"unknown"` until the first record
	 * arrives or when unsupported
	 */
	state: Accessor<CpuPressureLevel>;
}

const KNOWN_STATES: readonly CpuPressureLevel[] = ["nominal", "fair", "serious", "critical"];

const normalize = (state: string | undefined): CpuPressureLevel =>
	(KNOWN_STATES as readonly string[]).includes(state ?? "") ? (state as CpuPressureLevel) : "unknown";

/**
 * Compute Pressure API as a signal — observes the `"cpu"` pressure source on
 * mount and exposes the latest `state` (`"nominal" | "fair" | "serious" |
 * "critical"`). The observer is disconnected on cleanup. Degrades to
 * `supported: false` + `state() === "unknown"` where `PressureObserver` is
 * missing — never throws. Requires the `compute-pressure` Permissions-Policy
 * where enforced.
 *
 * @param options — `{ sampleInterval }` requested sampling interval in ms
 * @returns `{ supported, state }`
 *
 * @example
 * const cpu = useCpuPressure();
 * <Show when={cpu.state() === "critical"}><LowPowerBanner /></Show>
 */
export function useCpuPressure(options?: { sampleInterval?: number }): CpuPressureState {
	const supported = typeof window !== "undefined" && "PressureObserver" in window;
	const [state, setState] = createSignal<CpuPressureLevel>("unknown");
	let observer: PressureObserverLike | undefined;

	onMount(() => {
		const Ctor = supported ? (window as { PressureObserver?: PressureObserverCtor }).PressureObserver : undefined;
		if (!Ctor) return;
		try {
			observer = new Ctor(
				(records) => {
					const last = records[records.length - 1];
					if (last) setState(normalize(last.state));
				},
				options?.sampleInterval ? { sampleInterval: options.sampleInterval } : undefined,
			);
		} catch {
			return;
		}
		const obs = observer;
		try {
			void Promise.resolve(obs.observe("cpu")).catch(() => {});
		} catch {
			/* observe may throw synchronously on some implementations */
		}
	});

	onCleanup(() => {
		try {
			observer?.unobserve?.("cpu");
			observer?.disconnect();
		} catch {
			/* already disconnected */
		}
		observer = undefined;
	});

	return { supported, state };
}
