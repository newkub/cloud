import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type OnlineStatus = Accessor<boolean> & {
	/** Timestamp of the last online/offline transition — `undefined` until one fires */
	lastChangedAt: Accessor<Date | undefined>;
};

/**
 * Reactive online/offline status from `navigator.onLine` + window events.
 * SSR-safe: reports `true` when `navigator` is unavailable.
 * The returned accessor is callable like before and also exposes
 * `lastChangedAt()` — the `Date` of the most recent transition.
 *
 * @returns Accessor for the current online status, with `lastChangedAt`
 *
 * @example
 * const online = useOnline();
 * <Show when={!online()}>Offline since {online.lastChangedAt()?.toLocaleTimeString()}</Show>
 */
export function useOnline(): OnlineStatus {
	const [online, setOnline] = createSignal(typeof navigator === "undefined" ? true : navigator.onLine);
	const [lastChangedAt, setLastChangedAt] = createSignal<Date>();
	onMount(() => {
		const up = () => {
			setOnline(true);
			setLastChangedAt(new Date());
		};
		const down = () => {
			setOnline(false);
			setLastChangedAt(new Date());
		};
		window.addEventListener("online", up);
		window.addEventListener("offline", down);
		onCleanup(() => {
			window.removeEventListener("online", up);
			window.removeEventListener("offline", down);
		});
	});
	return Object.assign(online, { lastChangedAt });
}
