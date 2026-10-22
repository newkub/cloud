const serialize = (data: unknown): BodyInit | undefined => {
	if (data === undefined || data === null) return undefined;
	if (
		typeof data === "string" ||
		(typeof Blob !== "undefined" && data instanceof Blob) ||
		(typeof FormData !== "undefined" && data instanceof FormData) ||
		(typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams) ||
		data instanceof ArrayBuffer ||
		ArrayBuffer.isView(data)
	) {
		return data as BodyInit;
	}
	return new Blob([JSON.stringify(data)], { type: "application/json" });
};

export interface BeaconControls {
	/**
	 * `navigator.sendBeacon` — queues a tiny POST that survives page unload.
	 * Plain objects are JSON-encoded automatically. Returns false when
	 * unsupported (SSR, old browsers) or the browser rejected the payload.
	 */
	send: (url: string, data?: unknown) => boolean;
	/**
	 * Fire a beacon when the page is hidden/unloaded (`pagehide`).
	 * `data` may be an accessor — it is read at unload time.
	 */
	sendOnUnload: (url: string, data?: unknown | (() => unknown)) => void;
}

/**
 * `navigator.sendBeacon` wrapper — SSR-safe (send returns false when the
 * API is missing). Use `sendOnUnload` for analytics fired as the user leaves.
 *
 * @returns `{ send, sendOnUnload }`
 *
 * @example
 * const beacon = useBeacon();
 * beacon.sendOnUnload("/api/stats", () => ({ dwell: elapsed() }));
 * <button onClick={() => beacon.send("/api/event", { type: "click" })}>track</button>
 */
export function useBeacon(): BeaconControls {
	const send = (url: string, data?: unknown) => {
		if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return false;
		try {
			return navigator.sendBeacon(url, serialize(data));
		} catch {
			return false;
		}
	};

	const sendOnUnload = (url: string, data?: unknown | (() => unknown)) => {
		if (typeof window === "undefined") return;
		const handler = () => send(url, typeof data === "function" ? (data as () => unknown)() : data);
		window.addEventListener("pagehide", handler, { once: true });
	};

	return { send, sendOnUnload };
}
