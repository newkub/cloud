import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

const EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;

/**
 * An idle accessor — call it like a normal `Accessor<boolean>`. It also
 * carries `lastActive`, the epoch ms of the last observed activity
 * (set on mount and on every activity event).
 */
export type IdleAccessor = Accessor<boolean> & {
	/** Epoch ms of the last detected activity */
	lastActive: Accessor<number>;
};

/**
 * True once the user has been inactive for `ms` — resets on input.
 * The returned accessor exposes `lastActive` for "last seen" readouts.
 *
 * @param ms — Inactivity timeout in milliseconds. @default 60000
 * @param options — `events` override the activity list; `initialState` starts idle
 * @returns Accessor for the idle flag, with `lastActive` attached
 *
 * @example
 * const idle = useIdle(60_000);
 * <Show when={idle()}>Still there?</Show>
 * <Show when={!idle()}>active since {new Date(idle.lastActive()).toLocaleTimeString()}</Show>
 */
export function useIdle(
	ms = 60_000,
	options?: {
		/** Events that count as activity. @default pointerdown/pointermove/keydown/wheel/touchstart */
		events?: readonly string[];
		/** Start in the idle state. @default false */
		initialState?: boolean;
	},
): IdleAccessor {
	const [idle, setIdle] = createSignal(options?.initialState ?? false);
	const [lastActive, setLastActive] = createSignal(0);
	const events = options?.events ?? EVENTS;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const ping = () => {
		setIdle(false);
		setLastActive(Date.now());
		clearTimeout(timer);
		timer = setTimeout(() => setIdle(true), ms);
	};

	onMount(() => {
		if (!idle()) ping();
		for (const type of events) window.addEventListener(type, ping, { passive: true });
		onCleanup(() => {
			clearTimeout(timer);
			for (const type of events) window.removeEventListener(type, ping);
		});
	});
	return Object.assign(idle, { lastActive });
}
