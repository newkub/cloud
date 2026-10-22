import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface BroadcastChannelState {
	/** Broadcast a structured-cloneable message to every context on `name` */
	post: (msg: unknown) => void;
	/** Last message received on the channel — `undefined` until one arrives */
	lastMessage: Accessor<unknown>;
	/** Close the channel — `post` becomes a no-op and no further messages arrive */
	close: () => void;
	/** Whether `BroadcastChannel` exists */
	supported: boolean;
}

/**
 * `BroadcastChannel` as signals — messages posted from any tab, window, iframe
 * or worker with the same channel `name` land in `lastMessage`. The channel is
 * created eagerly and closed on cleanup (or manually via `close()`); when the
 * API is missing everything degrades to no-ops.
 *
 * @param name — Channel name shared across browsing contexts
 * @returns `{ post, lastMessage, close, supported }`
 *
 * @example
 * const bc = useBroadcastChannel("cart");
 * <button onClick={() => bc.post({ added: id })}>sync tabs</button>
 */
export function useBroadcastChannel(name: string): BroadcastChannelState {
	const [lastMessage, setLastMessage] = createSignal<unknown>();
	const supported = typeof BroadcastChannel !== "undefined";

	let channel: BroadcastChannel | undefined;
	if (supported) {
		channel = new BroadcastChannel(name);
		channel.onmessage = (e: MessageEvent) => setLastMessage(e.data);
	}

	const close = () => {
		channel?.close();
		channel = undefined;
	};

	onCleanup(close);

	return {
		post: (msg) => channel?.postMessage(msg),
		lastMessage,
		close,
		supported,
	};
}
