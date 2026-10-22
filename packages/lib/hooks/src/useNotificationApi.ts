import { type Accessor, createSignal, onMount } from "solid-js";

export type NotificationApiPermission = NotificationPermission | "unsupported";

export interface NotificationApiState {
	/** `window.Notification` support flag */
	supported: boolean;
	/** Current permission — updates after `request()` */
	permission: Accessor<NotificationApiPermission>;
	/** Ask for permission — resolves `"unsupported"` where the API is missing */
	request: () => Promise<NotificationApiPermission>;
	/**
	 * Show a notification — requests permission first when still `"default"`.
	 * Resolves `undefined` when unsupported or permission stays denied.
	 */
	notify: (title: string, options?: NotificationOptions) => Promise<Notification | undefined>;
}

/**
 * Notification API — reactive `permission()` plus `request()`/`notify()`.
 * `supported` is `false` where `Notification` is missing; calls then
 * resolve `"unsupported"`/`undefined` instead of throwing.
 *
 * @returns `{ supported, permission, request, notify }`
 *
 * @example
 * const notif = useNotificationApi();
 * <button onClick={() => notif.notify("Hi", { body: "from solid-ui" })}>Notify</button>
 */
export function useNotificationApi(): NotificationApiState {
	const supported = typeof window !== "undefined" && "Notification" in window;
	const [permission, setPermission] = createSignal<NotificationApiPermission>(
		supported ? Notification.permission : "unsupported",
	);

	onMount(() => {
		if (supported) setPermission(Notification.permission);
	});

	const request = async () => {
		if (!supported) return "unsupported";
		try {
			const p = await Notification.requestPermission();
			setPermission(p);
			return p;
		} catch {
			return permission();
		}
	};

	const notify = async (title: string, options?: NotificationOptions) => {
		if (!supported) return undefined;
		let p = permission();
		if (p === "default") p = await request();
		if (p !== "granted") return undefined;
		try {
			return new Notification(title, options);
		} catch {
			return undefined;
		}
	};

	return { supported, permission, request, notify };
}
