import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Reactive `navigator.mediaDevices.enumerateDevices()` — refreshes on
 * `devicechange` (plug/unplug) and when `kind` changes. Device `label`s are
 * empty strings until the page holds a matching media permission. Returns an
 * empty list where the API is missing.
 *
 * @param kind — Optional `MediaDeviceKind` filter (`"audioinput"`, `"videoinput"`, `"audiooutput"`)
 * @returns Accessor for the device list
 *
 * @example
 * const mics = useMediaDevices("audioinput");
 * <For each={mics()}>{(d) => <p>{d.label || "unnamed device"}</p>}</For>
 */
export function useMediaDevices(kind?: MaybeAccessor<MediaDeviceKind | undefined>): Accessor<MediaDeviceInfo[]> {
	const [all, setAll] = createSignal<MediaDeviceInfo[]>([]);

	onMount(() => {
		const md = navigator.mediaDevices;
		if (!md?.enumerateDevices) return;
		const refresh = async () => {
			try {
				setAll(await md.enumerateDevices());
			} catch {
				/* keep the previous list on failure */
			}
		};
		void refresh();
		md.addEventListener("devicechange", refresh);
		onCleanup(() => md.removeEventListener("devicechange", refresh));
	});

	return createMemo(() => {
		const k = resolve(kind);
		const list = all();
		return k ? list.filter((d) => d.kind === k) : list;
	});
}
