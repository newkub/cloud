import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ImagePreloadState {
	/** Number of images that finished loading */
	loaded: Accessor<number>;
	/** Total number of urls in the current batch */
	total: Accessor<number>;
	/** True once every image settled (loaded or failed) — also true for an empty list */
	done: Accessor<boolean>;
	/** Urls that failed to load */
	errors: Accessor<string[]>;
}

/**
 * Preload images via `new Image()` — tracks per-url progress as signals.
 * Reactive: re-runs when the url list accessor changes, resetting all counts.
 * `loaded()` only counts successes; failed urls land in `errors()`. `done()`
 * flips when every image settled. Handlers are detached on cleanup and inert
 * without `Image` (SSR). Browsers cache the results, so later `<img>` usage
 * renders instantly.
 *
 * @param urls — Array or accessor resolving to image urls
 * @returns `{ loaded, total, done, errors }`
 *
 * @example
 * const pre = useImagePreload(() => gallery().map(p => p.thumb));
 * <Show when={pre.done()} fallback={<span>{pre.loaded()}/{pre.total()}</span>}>
 *   <Gallery />
 * </Show>
 */
export function useImagePreload(urls: MaybeAccessor<readonly string[]>): ImagePreloadState {
	const [loaded, setLoaded] = createSignal(0);
	const [total, setTotal] = createSignal(0);
	const [done, setDone] = createSignal(false);
	const [errors, setErrors] = createSignal<string[]>([]);

	createEffect(() => {
		const list = [...(resolve(urls) ?? [])];
		setLoaded(0);
		setErrors([]);
		setTotal(list.length);
		if (typeof Image === "undefined" || list.length === 0) {
			setDone(true);
			return;
		}
		setDone(false);
		let remaining = list.length;
		const settle = () => {
			remaining -= 1;
			if (remaining <= 0) setDone(true);
		};
		const imgs: HTMLImageElement[] = [];
		for (const url of list) {
			const img = new Image();
			imgs.push(img);
			img.onload = () => {
				setLoaded((n) => n + 1);
				settle();
			};
			img.onerror = () => {
				setErrors((e) => [...e, url]);
				settle();
			};
			img.src = url;
		}
		onCleanup(() => {
			for (const img of imgs) {
				img.onload = null;
				img.onerror = null;
			}
		});
	});

	return { loaded, total, done, errors };
}
