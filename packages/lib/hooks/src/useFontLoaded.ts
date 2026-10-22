import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Whether a font shorthand is available, via the Font Loading API
 * (`document.fonts.check`). Re-checks when `font` changes, when a pending
 * face finishes (`loadingdone`), and once `document.fonts.ready` settles.
 * Stays `false` where the API is missing.
 *
 * @param font — CSS font shorthand like `"16px Inter"` or `"bold 24px 'My Font'"`
 * @returns Accessor for the loaded flag
 *
 * @example
 * const inter = useFontLoaded("16px Inter");
 * <Show when={inter()} fallback={<p>font loading…</p>}><p>Inter ready</p></Show>
 */
export function useFontLoaded(font: MaybeAccessor<string>): Accessor<boolean> {
	const [loaded, setLoaded] = createSignal(false);

	createEffect(() => {
		const f = resolve(font);
		if (typeof document === "undefined" || !document.fonts?.check || !f) return;
		const fonts = document.fonts;
		const check = () => {
			try {
				setLoaded(fonts.check(f));
			} catch {
				setLoaded(false);
			}
		};
		check();
		fonts.addEventListener("loadingdone", check);
		void fonts.ready.then(check).catch(() => {});
		onCleanup(() => fonts.removeEventListener("loadingdone", check));
	});

	return loaded;
}
