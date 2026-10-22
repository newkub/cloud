import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/** `screen.orientation.lock()` argument — declared locally because lib.dom omits it (Chromium-only API). */
export type ScreenOrientationLockType =
	| "any"
	| "natural"
	| "landscape"
	| "portrait"
	| "landscape-primary"
	| "landscape-secondary"
	| "portrait-primary"
	| "portrait-secondary";

// `lock`/`unlock` presence differs across lib.dom versions — Omit then re-declare optionally.
interface OrientationLockApi extends Omit<ScreenOrientation, "lock" | "unlock"> {
	lock?: (type: ScreenOrientationLockType) => Promise<void>;
	unlock?: () => void;
}

export interface ScreenOrientationLockState {
	/** Current `screen.orientation.type` — `undefined` when unsupported */
	orientation: Accessor<OrientationType | undefined>;
	/** Current `screen.orientation.angle` in degrees */
	angle: Accessor<number>;
	/** Lock the screen to an orientation — resolves after the change event; no-op when unsupported */
	lock: (type: ScreenOrientationLockType) => Promise<void>;
	/** Release any active orientation lock — no-op when unsupported */
	unlock: () => void;
	/** Whether `screen.orientation.lock` exists */
	supported: boolean;
}

const orientationApi = (): OrientationLockApi | undefined =>
	typeof screen !== "undefined" ? (screen.orientation as OrientationLockApi) : undefined;

/**
 * Screen Orientation locking — reactive `orientation`/`angle` plus `lock(type)`
 * and `unlock()` controls. Locking generally requires fullscreen on mobile;
 * the returned promise rejects (or resolves harmlessly) per platform rules —
 * callers should `.catch` it.
 *
 * @returns `{ orientation, angle, lock, unlock, supported }`
 *
 * @example
 * const o = useScreenOrientationLock();
 * <button onClick={() => o.lock("landscape").catch(() => {})}>landscape</button>
 */
export function useScreenOrientationLock(): ScreenOrientationLockState {
	const [orientation, setOrientation] = createSignal<OrientationType>();
	const [angle, setAngle] = createSignal(0);
	const api = orientationApi();
	const supported = !!api && typeof api.lock === "function";

	const read = () => {
		const o = orientationApi();
		setOrientation(o?.type);
		setAngle(o?.angle ?? 0);
	};

	onMount(() => {
		const o = orientationApi();
		if (!o) return;
		read();
		o.addEventListener("change", read);
		onCleanup(() => o.removeEventListener("change", read));
	});

	return {
		orientation,
		angle,
		supported,
		lock: async (type) => {
			const o = orientationApi();
			if (!o || typeof o.lock !== "function") return;
			await o.lock(type);
			read();
		},
		unlock: () => {
			orientationApi()?.unlock?.();
			read();
		},
	};
}
