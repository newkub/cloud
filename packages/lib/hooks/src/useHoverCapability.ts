import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface HoverCapabilityState {
	/** True when the primary input can hover (mouse/trackpad) — tracks media changes */
	canHover: Accessor<boolean>;
	/** Whether `window.matchMedia` exists */
	supported: boolean;
}

const QUERY = "(hover: hover)";

/**
 * Reactive `(hover: hover)` media query — `canHover()` is true on devices with
 * a precise pointing device and stays false on touch-first devices. Updates if
 * the capability changes (e.g. hybrid devices).
 *
 * @returns `{ canHover, supported }`
 *
 * @example
 * const { canHover } = useHoverCapability();
 * <Show when={canHover()}><Tooltip>only on hoverable devices</Tooltip></Show>
 */
export function useHoverCapability(): HoverCapabilityState {
	const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
	const [canHover, setCanHover] = createSignal(supported ? window.matchMedia(QUERY).matches : false);

	onMount(() => {
		if (!supported) return;
		const mql = window.matchMedia(QUERY);
		const update = () => setCanHover(mql.matches);
		update();
		mql.addEventListener("change", update);
		onCleanup(() => mql.removeEventListener("change", update));
	});

	return { canHover, supported };
}
