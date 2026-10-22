import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * Accessor that is `true` only during setup — flips to `false` once the
 * component mounts (or its owner is disposed). Useful to skip mount-run
 * effects.
 *
 * @returns `Accessor<boolean>`
 *
 * @example
 * const isFirst = useIsFirstRender();
 * createEffect(() => {
 *   if (isFirst()) return; // skip mount run
 *   save(value());
 * });
 */
export function useIsFirstRender(): Accessor<boolean> {
	const [first, setFirst] = createSignal(true);
	onMount(() => setFirst(false));
	onCleanup(() => setFirst(false));
	return first;
}
