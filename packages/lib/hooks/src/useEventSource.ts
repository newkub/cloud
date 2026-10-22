import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface EventSourceOptions {
	/** Send cookies/HTTP auth cross-origin — maps to the EventSource init flag */
	withCredentials?: boolean;
	/**
	 * Named SSE events — each key is `addEventListener`ed on the source,
	 * e.g. `{ "price-update": (e) => setPrice(e.data) }`
	 */
	events?: Record<string, (e: MessageEvent) => void>;
}

export interface EventSourceState {
	/** EventSource.readyState — 0 connecting, 1 open, 2 closed */
	readyState: Accessor<number>;
	/** Latest event data */
	message: Accessor<string | undefined>;
	/** Last event id (for resume) */
	lastEventId: Accessor<string | undefined>;
	close: () => void;
}

/** `EventSource.CLOSED` without touching the global at module/call time (SSR-safe). */
const ES_CLOSED = 2;

/**
 * Server-sent events via EventSource — reactive latest message + id.
 * Reconnects when `url()` changes; safe to call during SSR (stays CLOSED).
 * `options.withCredentials` enables cross-origin credentials and
 * `options.events` subscribes to named event types.
 *
 * @param url — Accessor for the stream URL
 * @param options — `withCredentials` flag, `events` named-event handlers
 * @returns Reactive EventSource state — `{ readyState, message, lastEventId, close }`
 *
 * @example
 * const feed = useEventSource(() => "/api/stream", { events: { tick: (e) => setNow(e.data) } });
 * <p>{feed.message()}</p>
 */
export function useEventSource(url: Accessor<string>, options?: EventSourceOptions): EventSourceState {
	const [readyState, setReadyState] = createSignal<number>(
		typeof EventSource === "undefined" ? ES_CLOSED : EventSource.CLOSED,
	);
	const [message, setMessage] = createSignal<string>();
	const [lastEventId, setLastEventId] = createSignal<string>();
	let source: EventSource | undefined;

	createEffect(() => {
		if (typeof EventSource === "undefined") return;
		const target = url();
		source?.close();
		const es = new EventSource(target, { withCredentials: options?.withCredentials });
		source = es;
		setReadyState(es.readyState);
		es.onopen = () => setReadyState(EventSource.OPEN);
		es.onerror = () => setReadyState(es.readyState);
		es.onmessage = (e) => {
			setMessage(e.data);
			setLastEventId(e.lastEventId);
		};
		if (typeof es.addEventListener === "function") {
			for (const [name, handler] of Object.entries(options?.events ?? {})) {
				es.addEventListener(name, handler);
			}
		}
		onCleanup(() => es.close());
	});

	return {
		readyState,
		message,
		lastEventId,
		close: () => {
			source?.close();
			setReadyState(typeof EventSource === "undefined" ? ES_CLOSED : EventSource.CLOSED);
		},
	};
}
