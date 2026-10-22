import { onCleanup } from "solid-js";

export interface EventBus<Events extends Record<string, unknown> = Record<string, unknown>> {
	/** Subscribe to an event. Returns an unsubscribe fn. */
	on<K extends keyof Events & string>(event: K, cb: (payload: Events[K]) => void): () => void;
	/** Emit an event to all subscribers. */
	emit<K extends keyof Events & string>(event: K, payload: Events[K]): void;
	/** Remove one handler (or all handlers for an event). */
	off<K extends keyof Events & string>(event: K, cb?: (payload: Events[K]) => void): void;
	/** Remove all handlers — for `event` when given, otherwise every channel. */
	clear<K extends keyof Events & string>(event?: K): void;
	/** Handlers for `event`, or total across all channels when omitted. */
	listenerCount<K extends keyof Events & string>(event?: K): number;
}

/**
 * Scoped typed pub/sub inside a component tree. All listeners created by this
 * bus are cleaned up with the owner — no leaks across mounts.
 *
 * @returns `{ on, emit, off, clear, listenerCount }`
 *
 * @example
 * const bus = useEventBus<{ saved: { id: string }; deleted: { id: string } }>();
 * bus.on("saved", ({ id }) => toast(`saved ${id}`));
 * bus.emit("saved", { id: "1" });
 */
export function useEventBus<Events extends Record<string, unknown> = Record<string, unknown>>(): EventBus<Events> {
	const handlers = new Map<string, Set<(payload: never) => void>>();

	const on: EventBus<Events>["on"] = (event, cb) => {
		let set = handlers.get(event);
		if (!set) {
			set = new Set();
			handlers.set(event, set);
		}
		set.add(cb as never);
		return () => off(event, cb);
	};

	const off: EventBus<Events>["off"] = (event, cb) => {
		const set = handlers.get(event);
		if (!set) return;
		if (cb) set.delete(cb as never);
		else set.clear();
		if (set.size === 0) handlers.delete(event);
	};

	const emit: EventBus<Events>["emit"] = (event, payload) => {
		for (const cb of [...(handlers.get(event) ?? [])]) (cb as (p: unknown) => void)(payload);
	};

	const clear = (event?: string) => {
		if (event === undefined) handlers.clear();
		else handlers.delete(event);
	};
	const listenerCount = (event?: string) =>
		event === undefined ? [...handlers.values()].reduce((n, s) => n + s.size, 0) : (handlers.get(event)?.size ?? 0);

	onCleanup(clear);
	return { on, emit, off, clear, listenerCount };
}
