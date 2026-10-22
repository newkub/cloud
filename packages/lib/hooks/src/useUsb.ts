import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface USBDeviceLike extends EventTarget {
	readonly vendorId: number;
	readonly productId: number;
	readonly productName?: string;
	readonly serialNumber?: string;
	readonly opened: boolean;
	open(): Promise<void>;
	close(): Promise<void>;
}

export interface USBLike extends EventTarget {
	getDevices(): Promise<USBDeviceLike[]>;
	requestDevice(options: { filters: ReadonlyArray<Record<string, unknown>> }): Promise<USBDeviceLike>;
}

export interface UsbState {
	/** `navigator.usb` support flag */
	supported: boolean;
	/** Granted devices — kept live via `connect`/`disconnect` events */
	devices: Accessor<ReadonlyArray<USBDeviceLike>>;
	/** True while at least one device is granted/connected */
	connected: Accessor<boolean>;
	/** Last error message */
	error: Accessor<string | undefined>;
	/** Open the device picker — resolves `undefined` on cancel/unsupported */
	requestDevice: (filters?: ReadonlyArray<Record<string, unknown>>) => Promise<USBDeviceLike | undefined>;
}

/**
 * WebUSB — enumerates already-granted devices on mount, keeps the list live
 * through `connect`/`disconnect`, and merges the picker result from
 * `requestDevice(filters)` into `devices`.
 *
 * @returns `{ supported, devices, connected, error, requestDevice }`
 *
 * @example
 * const usb = useUsb();
 * <button onClick={() => usb.requestDevice([{ vendorId: 0x2341 }])}>pick device</button>
 * <For each={usb.devices()}>{(d) => <li>{d.productName}</li>}</For>
 */
export function useUsb(): UsbState {
	const api = () => (typeof navigator === "undefined" ? undefined : (navigator as { usb?: USBLike }).usb);
	const supported = typeof navigator !== "undefined" && "usb" in navigator;
	const [devices, setDevices] = createSignal<ReadonlyArray<USBDeviceLike>>([]);
	const [error, setError] = createSignal<string>();

	const add = (device: USBDeviceLike) => setDevices((list) => (list.includes(device) ? list : [...list, device]));
	const drop = (device: USBDeviceLike) => setDevices((list) => list.filter((d) => d !== device));

	onMount(() => {
		const usb = api();
		if (!usb) return;
		usb
			.getDevices?.()
			.then(setDevices)
			.catch(() => {});
		const onConnect = (e: Event) => {
			const d = (e as Event & { device?: USBDeviceLike }).device;
			if (d) add(d);
		};
		const onDisconnect = (e: Event) => {
			const d = (e as Event & { device?: USBDeviceLike }).device;
			if (d) drop(d);
		};
		usb.addEventListener?.("connect", onConnect);
		usb.addEventListener?.("disconnect", onDisconnect);
		onCleanup(() => {
			usb.removeEventListener?.("connect", onConnect);
			usb.removeEventListener?.("disconnect", onDisconnect);
		});
	});

	return {
		supported,
		devices,
		connected: () => devices().length > 0,
		error,
		requestDevice: async (filters) => {
			const usb = api();
			if (!usb) return undefined;
			try {
				const device = await usb.requestDevice({ filters: filters ?? [] });
				add(device);
				setError(undefined);
				return device;
			} catch (e) {
				setError(e instanceof Error ? e.message : "requestDevice failed");
				return undefined;
			}
		},
	};
}
