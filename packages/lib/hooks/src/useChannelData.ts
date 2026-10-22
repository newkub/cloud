import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface ChannelDataControls<T> {
	/** Current value — synced across tabs/contexts on the same channel name. */
	value: Accessor<T>;
	/** Set locally and broadcast to peers. */
	set: (v: T | ((prev: T) => T)) => void;
	/** Whether BroadcastChannel is available (else set() is local-only). */
	synced: boolean;
}

/**
 * BroadcastChannel-backed reactive state — same `name` shares values across
 * tabs, iframes and workers. Degrades to plain local state when the API is
 * unavailable (SSR, older browsers, jsdom).
 *
 * @param name - channel name
 * @param initial - initial value
 * @returns `{ value, set, synced }`
 *
 * @example
 * const theme = useChannelData("app-theme", "light");
 * theme.set("dark"); // other tabs see it
 */
export function useChannelData<T>(name: string, initial: T): ChannelDataControls<T> {
	const [value, setValue] = createSignal<T>(initial);

	const supported = typeof BroadcastChannel !== "undefined";
	const channel = supported ? new BroadcastChannel(name) : undefined;

	if (channel) {
		channel.onmessage = (e: MessageEvent<T>) => setValue(() => e.data);
		onCleanup(() => {
			channel.onmessage = null;
			channel.close();
		});
	}

	const set = (v: T | ((prev: T) => T)) => {
		const next = typeof v === "function" ? (v as (p: T) => T)(value()) : v;
		setValue(() => next);
		channel?.postMessage(next);
	};

	return { value, set, synced: supported };
}
