import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface HIDDeviceLike extends EventTarget {
	readonly vendorId: number;
	readonly productId: number;
	readonly productName?: string;
	readonly opened: boolean;
	open(): Promise<void>;
	close(): Promise<void>;
	collections?: ReadonlyArray<Record<string, unknown>>;
}

export interface HIDLike extends EventTarget {
	getDevices(): Promise<HIDDeviceLike[]>;
	requestDevice(options: { filters?: ReadonlyArray<Record<string, unknown>> }): Promise<HIDDeviceLike[]>;
}

export interface HidState {
	/** `navigator.hid` support flag */
	supported: boolean;
	/** Granted devices — kept live via `connect`/`disconnect` events */
	devices: Accessor<ReadonlyArray<HIDDeviceLike>>;
	/** True while at least one device is granted/connected */
	connected: Accessor<boolean>;
	/** Last error message */
	error: Accessor<string | undefined>;
	/** Open the device picker — resolves `[]` on cancel/unsupported */
	requestDevice: (filters?: ReadonlyArray<Record<string, unknown>>) => Promise<ReadonlyArray<HIDDeviceLike>>;
}

/**
 * WebHID — enumerates already-granted devices on mount, keeps the list live
 * through `connect`/`disconnect`, and merges picker results from
 * `requestDevice(filters)` into `devices`.
 *
 * @returns `{ supported, devices, connected, error, requestDevice }`
 *
 * @example
 * const hid = useHid();
 * <button onClick={() => hid.requestDevice([{ vendorId: 0x054c }])}>pick gamepad</button>
 * <For each={hid.devices()}>{(d) => <li>{d.productName}</li>}</For>
 */
export function useHid(): HidState {
	const api = () => (typeof navigator === "undefined" ? undefined : (navigator as { hid?: HIDLike }).hid);
	const supported = typeof navigator !== "undefined" && "hid" in navigator;
	const [devices, setDevices] = createSignal<ReadonlyArray<HIDDeviceLike>>([]);
	const [error, setError] = createSignal<string>();

	const add = (device: HIDDeviceLike) => setDevices((list) => (list.includes(device) ? list : [...list, device]));
	const drop = (device: HIDDeviceLike) => setDevices((list) => list.filter((d) => d !== device));

	onMount(() => {
		const hid = api();
		if (!hid) return;
		hid
			.getDevices?.()
			.then(setDevices)
			.catch(() => {});
		const onConnect = (e: Event) => {
			const d = (e as Event & { device?: HIDDeviceLike }).device;
			if (d) add(d);
		};
		const onDisconnect = (e: Event) => {
			const d = (e as Event & { device?: HIDDeviceLike }).device;
			if (d) drop(d);
		};
		hid.addEventListener?.("connect", onConnect);
		hid.addEventListener?.("disconnect", onDisconnect);
		onCleanup(() => {
			hid.removeEventListener?.("connect", onConnect);
			hid.removeEventListener?.("disconnect", onDisconnect);
		});
	});

	return {
		supported,
		devices,
		connected: () => devices().length > 0,
		error,
		requestDevice: async (filters) => {
			const hid = api();
			if (!hid) return [];
			try {
				const picked = await hid.requestDevice(filters ? { filters } : {});
				for (const d of picked) add(d);
				setError(undefined);
				return picked;
			} catch (e) {
				setError(e instanceof Error ? e.message : "requestDevice failed");
				return [];
			}
		},
	};
}
