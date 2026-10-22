import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * Accessor for the visible flag, extended with timing detail — still callable
 * like before (`visible()`), plus `hiddenAt`/`state` members.
 */
export interface VisibilityState extends Accessor<boolean> {
	/** Epoch ms when the tab last became hidden — undefined if it never did */
	hiddenAt: Accessor<number | undefined>;
	/** Raw `document.visibilityState` */
	state: Accessor<DocumentVisibilityState>;
}

/**
 * Reactive `document.visibilityState` — true while the tab is visible. The
 * returned accessor also exposes `hiddenAt` (timestamp of the last hide) and
 * `state` (raw visibilityState).
 *
 * @returns Accessor for the visible flag with `hiddenAt`/`state` members
 *
 * @example
 * const visible = useVisibility();
 * <Show when={!visible()}>paused — tab hidden</Show>
 * <Show when={visible.hiddenAt()}>last hidden {new Date(visible.hiddenAt()!).toLocaleTimeString()}</Show>
 */
export function useVisibility(): VisibilityState {
	const [visible, setVisible] = createSignal(true);
	const [hiddenAt, setHiddenAt] = createSignal<number>();
	const [state, setState] = createSignal<DocumentVisibilityState>("visible");

	onMount(() => {
		const read = () => {
			const s = document.visibilityState;
			setState(s);
			if (s !== "visible" && visible()) setHiddenAt(Date.now());
			setVisible(s === "visible");
		};
		read();
		document.addEventListener("visibilitychange", read);
		onCleanup(() => document.removeEventListener("visibilitychange", read));
	});

	const result = visible as VisibilityState;
	result.hiddenAt = hiddenAt;
	result.state = state;
	return result;
}
