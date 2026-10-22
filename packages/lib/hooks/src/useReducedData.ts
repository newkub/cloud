import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { NetworkInformationLike } from "./useNetwork";

export interface ReducedDataState {
	/** `navigator.connection.saveData` — user enabled a data-saver mode */
	saveData: Accessor<boolean>;
	/** `(prefers-reduced-data: reduce)` media query — CSS-level data reduction hint */
	prefersReducedData: Accessor<boolean>;
	/** `saveData || prefersReducedData` — serve the lite experience when true */
	limited: Accessor<boolean>;
}

const QUERY = "(prefers-reduced-data: reduce)";

/**
 * Data-thrift hints as signals — combines the `Save-Data` client hint
 * (`navigator.connection.saveData`) with the `(prefers-reduced-data: reduce)`
 * media query into a single `limited()` flag. Both sources are optional APIs;
 * `limited()` simply stays false when neither exists.
 *
 * @returns `{ saveData, prefersReducedData, limited }`
 *
 * @example
 * const { limited } = useReducedData();
 * <Show when={limited()} fallback={<HeroVideo />}><HeroImage /></Show>
 */
export function useReducedData(): ReducedDataState {
	const conn = (): NetworkInformationLike | undefined =>
		typeof navigator !== "undefined" ? (navigator as { connection?: NetworkInformationLike }).connection : undefined;
	const hasMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";

	const [saveData, setSaveData] = createSignal(conn()?.saveData ?? false);
	const [prefersReducedData, setPrefersReducedData] = createSignal(
		hasMatchMedia ? window.matchMedia(QUERY).matches : false,
	);
	const limited = createMemo(() => saveData() || prefersReducedData());

	onMount(() => {
		const mql = hasMatchMedia ? window.matchMedia(QUERY) : undefined;
		const updateMedia = () => mql && setPrefersReducedData(mql.matches);
		mql?.addEventListener("change", updateMedia);

		const c = conn();
		const updateConn = () => setSaveData(c?.saveData ?? false);
		c?.addEventListener("change", updateConn);

		onCleanup(() => {
			mql?.removeEventListener("change", updateMedia);
			c?.removeEventListener("change", updateConn);
		});
	});

	return { saveData, prefersReducedData, limited };
}
