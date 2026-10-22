import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PageLeaveOptions {
	/** Fire only the first time the pointer leaves. @default true */
	once?: boolean;
}

/**
 * Exit-intent — flips true (and fires `onLeave`) when the pointer leaves the
 * document through the top edge, e.g. toward the tab or URL bar. SSR-safe.
 *
 * @param onLeave — Optional callback fired on exit-intent
 * @param options — `once` keeps it to a single trigger. @default `{ once: true }`
 * @returns Accessor — `true` after the pointer has left
 *
 * @example
 * const left = usePageLeave(() => showOffer(), { once: true });
 * <Show when={left()}>Wait — grab a discount!</Show>
 */
export function usePageLeave(onLeave?: () => void, options?: PageLeaveOptions): Accessor<boolean> {
	const [left, setLeft] = createSignal(false);
	const once = options?.once ?? true;

	onMount(() => {
		const handler = (e: MouseEvent) => {
			// Only count exits through the top edge of the viewport.
			if (e.clientY > 0) return;
			setLeft(true);
			onLeave?.();
			if (once) document.removeEventListener("mouseleave", handler);
		};
		document.addEventListener("mouseleave", handler);
		onCleanup(() => document.removeEventListener("mouseleave", handler));
	});

	return left;
}
