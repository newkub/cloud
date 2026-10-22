import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/** `"continuous"`, `"folded"`, or a future value — kept as plain string */
export type DevicePostureType = "continuous" | "folded" | (string & {});

export interface DevicePostureLike extends EventTarget {
	readonly type: string;
}

export interface DevicePostureState {
	/** `navigator.devicePosture` support flag */
	supported: boolean;
	/** Current posture — `"continuous"` when the API is missing */
	posture: Accessor<string>;
}

/**
 * Device Posture API — tracks `navigator.devicePosture.type` (`"continuous"`
 * / `"folded"`) via the `change` event. Reports `"continuous"` where the API
 * is unavailable so layouts degrade to the flat case.
 *
 * @returns `{ supported, posture }`
 *
 * @example
 * const dp = useDevicePosture();
 * <div classList={{ folded: dp.posture() === "folded" }}>…</div>
 */
export function useDevicePosture(): DevicePostureState {
	const api =
		typeof navigator === "undefined" ? undefined : (navigator as { devicePosture?: DevicePostureLike }).devicePosture;
	const supported = typeof navigator !== "undefined" && "devicePosture" in navigator;
	const [posture, setPosture] = createSignal(api?.type ?? "continuous");

	onMount(() => {
		if (!api) return;
		const onChange = () => setPosture(api.type);
		api.addEventListener("change", onChange);
		onCleanup(() => api.removeEventListener("change", onChange));
	});

	return { supported, posture };
}
