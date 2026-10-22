import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface BluetoothDeviceLike extends EventTarget {
	readonly id: string;
	readonly name?: string;
	readonly gatt?: { readonly connected: boolean };
}

export interface BluetoothRequestOptions {
	/** Filter list — omit and pass `acceptAllDevices: true` to show every device */
	filters?: ReadonlyArray<Record<string, unknown>>;
	acceptAllDevices?: boolean;
	optionalServices?: ReadonlyArray<string | number>;
}

interface BluetoothLike extends EventTarget {
	getAvailability(): Promise<boolean>;
	requestDevice(options: Record<string, unknown>): Promise<BluetoothDeviceLike>;
}

const bluetooth = (): BluetoothLike | undefined =>
	typeof navigator === "undefined" ? undefined : (navigator as { bluetooth?: BluetoothLike }).bluetooth;

export interface BluetoothState {
	/** `navigator.bluetooth` support flag */
	supported: boolean;
	/** Radio availability (from `getAvailability` / `availabilitychanged`) */
	available: Accessor<boolean>;
	/** Last device picked via `requestDevice` */
	device: Accessor<BluetoothDeviceLike | undefined>;
	/** Last error message (user cancel included) */
	error: Accessor<string | undefined>;
	/** Opens the browser picker — requires a user gesture; resolves `undefined` on cancel/error */
	requestDevice: (options?: BluetoothRequestOptions) => Promise<BluetoothDeviceLike | undefined>;
}

/**
 * Web Bluetooth — device picker + availability state.
 * `supported` is `false` where `navigator.bluetooth` is missing; `requestDevice`
 * then resolves `undefined` instead of throwing.
 *
 * @returns `{ supported, available, device, error, requestDevice }`
 *
 * @example
 * const bt = useBluetooth();
 * <button disabled={!bt.supported} onClick={() => bt.requestDevice({ acceptAllDevices: true })}>
 *   pair device
 * </button>
 */
export function useBluetooth(): BluetoothState {
	const supported = typeof navigator !== "undefined" && "bluetooth" in navigator;
	const [available, setAvailable] = createSignal(false);
	const [device, setDevice] = createSignal<BluetoothDeviceLike>();
	const [error, setError] = createSignal<string>();

	const requestDevice = async (options?: BluetoothRequestOptions) => {
		const api = bluetooth();
		if (!api) return undefined;
		try {
			const d = await api.requestDevice((options ?? { acceptAllDevices: true }) as Record<string, unknown>);
			setDevice(d);
			setError(undefined);
			return d;
		} catch (e) {
			setError(e instanceof Error ? e.message : "requestDevice failed");
			return undefined;
		}
	};

	onMount(() => {
		const api = bluetooth();
		if (!api) return;
		api
			.getAvailability()
			.then(setAvailable)
			.catch(() => setAvailable(false));
		const onAvailability = (e: Event) => setAvailable((e as Event & { value?: boolean }).value ?? false);
		api.addEventListener("availabilitychanged", onAvailability);
		onCleanup(() => api.removeEventListener("availabilitychanged", onAvailability));
	});

	return { supported, available, device, error, requestDevice };
}
