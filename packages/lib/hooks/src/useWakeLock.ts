import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

interface WakeLockSentinelLike extends EventTarget {
	readonly released: boolean;
	release(): Promise<void>;
}

interface WakeLockLike {
	request(type: "screen"): Promise<WakeLockSentinelLike>;
}

const wakeLock = (): WakeLockLike | undefined =>
	typeof navigator === "undefined" ? undefined : (navigator as { wakeLock?: WakeLockLike }).wakeLock;

export interface WakeLockState {
	/** `navigator.wakeLock` support flag */
	supported: boolean;
	/** True while a screen wake lock is held */
	active: Accessor<boolean>;
	/** Last request/release error message */
	error: Accessor<string | undefined>;
	/** Acquire a screen wake lock — no-op when unsupported */
	request: () => Promise<void>;
	/** Release the held sentinel */
	release: () => Promise<void>;
}

/**
 * Screen Wake Lock API — keeps the display on while `active()`.
 * Automatically re-requests the lock when the tab becomes visible again
 * (the browser drops sentinels on hide). `supported` is `false` where the
 * API is missing — `request` then resolves without throwing.
 *
 * @returns `{ supported, active, error, request, release }`
 *
 * @example
 * const lock = useWakeLock();
 * <button onClick={() => (lock.active() ? lock.release() : lock.request())}>
 *   {lock.active() ? "Allow sleep" : "Keep awake"}
 * </button>
 */
export function useWakeLock(): WakeLockState {
	const supported = typeof navigator !== "undefined" && "wakeLock" in navigator;
	const [active, setActive] = createSignal(false);
	const [error, setError] = createSignal<string>();
	let sentinel: WakeLockSentinelLike | undefined;

	const request = async () => {
		const api = wakeLock();
		if (!api) return;
		try {
			const s = await api.request("screen");
			sentinel = s;
			setActive(!s.released);
			setError(undefined);
			s.addEventListener("release", () => setActive(false));
		} catch (e) {
			setActive(false);
			setError(e instanceof Error ? e.message : "wake lock request failed");
		}
	};

	const release = async () => {
		try {
			await sentinel?.release();
		} catch {
			// already released
		}
		sentinel = undefined;
		setActive(false);
	};

	onMount(() => {
		// Browsers auto-release on tab hide — re-acquire when visible again.
		const onVisible = () => {
			if (!document.hidden && active() && sentinel?.released) void request();
		};
		document.addEventListener("visibilitychange", onVisible);
		onCleanup(() => {
			document.removeEventListener("visibilitychange", onVisible);
			void release();
		});
	});

	return { supported, active, error, request, release };
}
