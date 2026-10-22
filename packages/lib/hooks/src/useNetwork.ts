import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface NetworkInformationLike extends EventTarget {
	effectiveType?: string;
	downlink?: number;
	rtt?: number;
	saveData?: boolean;
	type?: string;
	downlinkMax?: number;
}

export interface NetworkState {
	/** e.g. "4g", "3g" — undefined when the API is unavailable */
	effectiveType: Accessor<string | undefined>;
	/** Estimated Mbps */
	downlink: Accessor<number | undefined>;
	/** Estimated round-trip ms */
	rtt: Accessor<number | undefined>;
	/** Data-saver flag */
	saveData: Accessor<boolean>;
	/** Connection medium, e.g. "wifi", "cellular" */
	type: Accessor<string | undefined>;
	/** Max downlink for the connection technology, Mbps */
	downlinkMax: Accessor<number | undefined>;
	/** Timestamp of the last `change` event */
	changedAt: Accessor<Date | undefined>;
	/** Whether NetworkInformation exists */
	supported: boolean;
}

/**
 * Reactive `navigator.connection` (NetworkInformation API).
 * `supported` is a static flag — check it before relying on the accessors.
 * Pass `onChange` to be notified after each `change` event.
 *
 * @param options — `onChange` runs after every connection `change` event
 * @returns `{ effectiveType, downlink, rtt, saveData, type, downlinkMax, changedAt, supported }`
 *
 * @example
 * const net = useNetwork();
 * <Show when={net.saveData()}>low-data mode</Show>
 */
export function useNetwork(options?: { onChange?: (conn: NetworkInformationLike) => void }): NetworkState {
	const conn = (): NetworkInformationLike | undefined =>
		(navigator as { connection?: NetworkInformationLike }).connection;
	const [effectiveType, setEffectiveType] = createSignal<string>();
	const [downlink, setDownlink] = createSignal<number>();
	const [rtt, setRtt] = createSignal<number>();
	const [saveData, setSaveData] = createSignal(false);
	const [type, setType] = createSignal<string>();
	const [downlinkMax, setDownlinkMax] = createSignal<number>();
	const [changedAt, setChangedAt] = createSignal<Date>();
	const supported = typeof navigator !== "undefined" && "connection" in navigator;

	onMount(() => {
		const c = conn();
		if (!c) return;
		const read = () => {
			setEffectiveType(c.effectiveType);
			setDownlink(c.downlink);
			setRtt(c.rtt);
			setSaveData(c.saveData ?? false);
			setType(c.type);
			setDownlinkMax(c.downlinkMax);
		};
		read();
		const onChange = () => {
			read();
			setChangedAt(new Date());
			options?.onChange?.(c);
		};
		c.addEventListener("change", onChange);
		onCleanup(() => c.removeEventListener("change", onChange));
	});

	return { effectiveType, downlink, rtt, saveData, type, downlinkMax, changedAt, supported };
}
