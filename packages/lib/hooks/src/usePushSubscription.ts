import { type Accessor, createSignal, onMount } from "solid-js";

const urlBase64ToUint8Array = (base64: string): Uint8Array => {
	const padding = "=".repeat((4 - (base64.length % 4)) % 4);
	const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
	const raw = typeof atob === "function" ? atob(normalized) : normalized;
	const out = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
	return out;
};

export interface PushSubscriptionState {
	/** `serviceWorker` + `PushManager` support flag */
	supported: boolean;
	/** The active push subscription — undefined until fetched/subscribed */
	subscription: Accessor<PushSubscription | undefined>;
	/** Last error message (permission denial included) */
	error: Accessor<string | undefined>;
	/**
	 * Subscribe via the ready service worker registration.
	 * @param vapidKey — Base64url application server key (optional)
	 * @returns The subscription, or `undefined` on failure/unsupported
	 */
	subscribe: (vapidKey?: string) => Promise<PushSubscription | undefined>;
	/** Cancel the current subscription — resolves `false` when none/unsupported */
	unsubscribe: () => Promise<boolean>;
}

/**
 * Web Push — reads the existing push subscription from the ready service
 * worker registration on mount, and exposes `subscribe(vapidKey)` /
 * `unsubscribe()`. Everything resolves to benign fallbacks where push is
 * unsupported.
 *
 * @returns `{ supported, subscription, error, subscribe, unsubscribe }`
 *
 * @example
 * const push = usePushSubscription();
 * <button onClick={() => push.subscribe(PUBLIC_VAPID)}>enable notifications</button>
 */
export function usePushSubscription(): PushSubscriptionState {
	const supported =
		typeof navigator !== "undefined" &&
		"serviceWorker" in navigator &&
		typeof window !== "undefined" &&
		"PushManager" in window;
	const [subscription, setSubscription] = createSignal<PushSubscription>();
	const [error, setError] = createSignal<string>();

	onMount(() => {
		if (!supported) return;
		navigator.serviceWorker.ready
			.then((reg) => reg.pushManager.getSubscription())
			.then((sub) => {
				setSubscription(sub ?? undefined);
				setError(undefined);
			})
			.catch((e) => setError(e instanceof Error ? e.message : "push lookup failed"));
	});

	const subscribe = async (vapidKey?: string) => {
		if (!supported) return undefined;
		try {
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: vapidKey ? (urlBase64ToUint8Array(vapidKey) as BufferSource) : undefined,
			});
			setSubscription(sub);
			setError(undefined);
			return sub;
		} catch (e) {
			setError(e instanceof Error ? e.message : "push subscribe failed");
			return undefined;
		}
	};

	const unsubscribe = async () => {
		const sub = subscription();
		if (!sub) return false;
		try {
			const ok = await sub.unsubscribe();
			if (ok) setSubscription(undefined);
			setError(undefined);
			return ok;
		} catch (e) {
			setError(e instanceof Error ? e.message : "push unsubscribe failed");
			return false;
		}
	};

	return { supported, subscription, error, subscribe, unsubscribe };
}
