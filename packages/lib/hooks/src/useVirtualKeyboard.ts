import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export interface VirtualKeyboardState {
	/** Estimated on-screen keyboard height in px — `0` when hidden or unsupported */
	height: Accessor<number>;
	/** Heuristic — true when the visual viewport shrank by more than 80px */
	visible: Accessor<boolean>;
	/** Whether `window.visualViewport` exists */
	supported: boolean;
}

/** Viewport shrink (px) above which the keyboard is considered visible. */
const VISIBLE_THRESHOLD = 80;

/**
 * Approximate virtual-keyboard geometry via `visualViewport` resize — when a
 * mobile on-screen keyboard opens, the visual viewport shrinks while
 * `window.innerHeight` stays put; the difference is the keyboard `height`.
 * `visible` flips on once the shrink exceeds 80px.
 *
 * @returns `{ height, visible, supported }`
 *
 * @example
 * const kb = useVirtualKeyboard();
 * <div style={{ "padding-bottom": `${kb.height()}px` }}><input /></div>
 */
export function useVirtualKeyboard(): VirtualKeyboardState {
	const [height, setHeight] = createSignal(0);
	const visible = createMemo(() => height() > VISIBLE_THRESHOLD);
	const supported = typeof window !== "undefined" && !!window.visualViewport;

	onMount(() => {
		const vv = window.visualViewport;
		if (!vv) return;
		const update = () => {
			setHeight(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
		};
		update();
		vv.addEventListener("resize", update);
		onCleanup(() => vv.removeEventListener("resize", update));
	});

	return { height, visible, supported };
}
