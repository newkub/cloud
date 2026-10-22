import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface GamepadState {
	/** True while a gamepad is connected */
	connected: Accessor<boolean>;
	/** Gamepad id string (e.g. `"Xbox 360 Controller (XInput …)"`) — `null` when disconnected */
	id: Accessor<string | null>;
	/** Index in `navigator.getGamepads()` — `null` when disconnected */
	index: Accessor<number | null>;
	/** Pressed state of each button, refreshed every animation frame */
	buttons: Accessor<boolean[]>;
	/** Analog stick/trigger axes (−1–1), refreshed every animation frame */
	axes: Accessor<number[]>;
	/** Whether `navigator.getGamepads` exists */
	supported: boolean;
}

/**
 * First connected gamepad as signals — listens for `gamepadconnected` /
 * `gamepaddisconnected` and polls `navigator.getGamepads()` on a rAF loop
 * (the Gamepad API has no change events, so `buttons`/`axes` only update via
 * polling). `connected()` flips immediately on the DOM events; state resets
 * on disconnect. The poll loop and listeners are cleaned up on unmount.
 * SSR-safe: `supported` is `false` without `navigator.getGamepads`.
 *
 * @returns `{ connected, id, index, buttons, axes, supported }`
 *
 * @example
 * const pad = useGamepad();
 * <Show when={pad.connected()}>
 *   <span>{pad.id()} — {pad.buttons().filter(Boolean).length} buttons held</span>
 * </Show>
 */
export function useGamepad(): GamepadState {
	const [connected, setConnected] = createSignal(false);
	const [id, setId] = createSignal<string | null>(null);
	const [index, setIndex] = createSignal<number | null>(null);
	const [buttons, setButtons] = createSignal<boolean[]>([]);
	const [axes, setAxes] = createSignal<number[]>([]);
	const supported = typeof navigator !== "undefined" && "getGamepads" in navigator;
	let padIndex: number | null = null;
	let raf = 0;

	const read = (pad: Gamepad | null | undefined) => {
		if (!pad) return;
		setButtons(pad.buttons.map((b) => b.pressed));
		setAxes(Array.from(pad.axes));
	};

	const disconnect = () => {
		padIndex = null;
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		setConnected(false);
		setId(null);
		setIndex(null);
		setButtons([]);
		setAxes([]);
	};

	const poll = () => {
		if (padIndex === null || typeof navigator === "undefined") return;
		const pad = navigator.getGamepads?.()[padIndex];
		if (!pad) {
			disconnect();
			return;
		}
		read(pad);
		raf = requestAnimationFrame(poll);
	};

	onMount(() => {
		if (!supported) return;
		const onConnect = (e: Event) => {
			const pad = (e as GamepadEvent).gamepad;
			if (!pad) return;
			padIndex = pad.index;
			setConnected(true);
			setId(pad.id);
			setIndex(pad.index);
			read(pad);
			if (raf) cancelAnimationFrame(raf);
			raf = requestAnimationFrame(poll);
		};
		const onDisconnect = (e: Event) => {
			const pad = (e as GamepadEvent).gamepad;
			if (pad && padIndex !== null && pad.index !== padIndex) return;
			disconnect();
		};
		window.addEventListener("gamepadconnected", onConnect);
		window.addEventListener("gamepaddisconnected", onDisconnect);
		onCleanup(() => {
			window.removeEventListener("gamepadconnected", onConnect);
			window.removeEventListener("gamepaddisconnected", onDisconnect);
			disconnect();
		});
	});

	return { connected, id, index, buttons, axes, supported };
}
