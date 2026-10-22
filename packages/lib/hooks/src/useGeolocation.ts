import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface GeolocationState {
	/** Latest position fix */
	position: Accessor<GeolocationPosition | undefined>;
	/** Positioning error message */
	error: Accessor<string | undefined>;
	/** True while waiting for the first fix */
	loading: Accessor<boolean>;
	/** Horizontal accuracy in meters from the latest fix */
	accuracy: Accessor<number | undefined>;
	/** Ground speed in m/s — null-ish devices report undefined */
	speed: Accessor<number | undefined>;
	/** Whether navigator.geolocation exists */
	supported: boolean;
	/** Request a one-off fix outside the watch */
	refresh: () => void;
}

export interface UseGeolocationOptions extends PositionOptions {
	/** Keep watching (watchPosition). Set false for a single getCurrentPosition. @default true */
	watch?: boolean;
}

/**
 * `navigator.geolocation` as signals — watches position by default
 * (`{ watch: false }` takes a single fix). `loading()` stays true until the
 * first fix or error; `error()` reports `"geolocation unavailable"` when the
 * API is missing. `accuracy()`/`speed()` mirror the latest `coords`.
 *
 * @param options — PositionOptions plus `watch`
 * @returns `{ position, error, loading, accuracy, speed, supported, refresh }`
 *
 * @example
 * const geo = useGeolocation({ enableHighAccuracy: true });
 * <p>{geo.position()?.coords.latitude} ±{geo.accuracy()}m</p>
 */
export function useGeolocation(options?: UseGeolocationOptions): GeolocationState {
	const [position, setPosition] = createSignal<GeolocationPosition>();
	const [error, setError] = createSignal<string>();
	const [loading, setLoading] = createSignal(true);
	const [accuracy, setAccuracy] = createSignal<number>();
	const [speed, setSpeed] = createSignal<number>();
	const supported = typeof navigator !== "undefined" && "geolocation" in navigator;
	const { watch = true, ...positionOptions } = options ?? {};

	const onFix = (p: GeolocationPosition) => {
		setPosition(p);
		setAccuracy(p.coords.accuracy ?? undefined);
		setSpeed(p.coords.speed ?? undefined);
		setError(undefined);
		setLoading(false);
	};
	const onError = (e: GeolocationPositionError) => {
		setError(e.message);
		setLoading(false);
	};

	onMount(() => {
		if (!navigator.geolocation) {
			setError("geolocation unavailable");
			setLoading(false);
			return;
		}
		if (watch) {
			const id = navigator.geolocation.watchPosition(onFix, onError, positionOptions);
			onCleanup(() => navigator.geolocation?.clearWatch(id));
		} else {
			navigator.geolocation.getCurrentPosition(onFix, onError, positionOptions);
		}
	});

	return {
		position,
		error,
		loading,
		accuracy,
		speed,
		supported,
		refresh: () => {
			if (!supported) return;
			setLoading(true);
			navigator.geolocation.getCurrentPosition(onFix, onError, positionOptions);
		},
	};
}
