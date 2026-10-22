import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ModifierKeys {
	/** True while Ctrl is held */
	ctrl: Accessor<boolean>;
	/** True while Shift is held */
	shift: Accessor<boolean>;
	/** True while Alt/Option is held */
	alt: Accessor<boolean>;
	/** True while Meta/Cmd/Win is held */
	meta: Accessor<boolean>;
}

/**
 * Live modifier-key state — tracks keydown/keyup on window and resets all
 * flags on window blur so keys never stick. SSR-safe.
 *
 * @returns `{ ctrl, shift, alt, meta }` accessors
 *
 * @example
 * const mods = useModifierKeys();
 * <div class={mods.shift() ? "multi-select" : ""}>…</div>
 */
export function useModifierKeys(): ModifierKeys {
	const [ctrl, setCtrl] = createSignal(false);
	const [shift, setShift] = createSignal(false);
	const [alt, setAlt] = createSignal(false);
	const [meta, setMeta] = createSignal(false);

	const sync = (e: KeyboardEvent) => {
		setCtrl(e.ctrlKey);
		setShift(e.shiftKey);
		setAlt(e.altKey);
		setMeta(e.metaKey);
	};

	const reset = () => {
		setCtrl(false);
		setShift(false);
		setAlt(false);
		setMeta(false);
	};

	onMount(() => {
		window.addEventListener("keydown", sync);
		window.addEventListener("keyup", sync);
		window.addEventListener("blur", reset);
		onCleanup(() => {
			window.removeEventListener("keydown", sync);
			window.removeEventListener("keyup", sync);
			window.removeEventListener("blur", reset);
		});
	});

	return { ctrl, shift, alt, meta };
}
