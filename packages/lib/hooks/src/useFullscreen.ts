import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface FullscreenControls {
	/** Attach to the element to fullscreen */
	ref: (el: HTMLElement) => void;
	/** True while the document is in fullscreen */
	active: Accessor<boolean>;
	/** Whether the Fullscreen API is enabled */
	supported: boolean;
	enter: () => Promise<void>;
	exit: () => Promise<void>;
}

export interface UseFullscreenOptions {
	/** Element (or accessor) to fullscreen instead of the `ref`-bound one */
	element?: MaybeAccessor<HTMLElement | undefined>;
	/** Fires on every fullscreenchange with the new state */
	onChange?: (active: boolean) => void;
	/** Forwarded to `requestFullscreen()` (e.g. `{ navigationUI: "hide" }`) */
	requestOptions?: FullscreenOptions;
}

/**
 * Fullscreen API as signals — `enter()`/`exit()` + reactive `active()`.
 * Optionally target an element via `options.element` (the `ref` callback still
 * works) and observe transitions via `options.onChange`.
 *
 * @param options — `element` target override, `onChange` listener, `requestOptions`
 * @returns `{ ref, active, supported, enter, exit }` — attach `ref` to the element to fullscreen
 *
 * @example
 * const fs = useFullscreen({ onChange: (a) => console.log("fullscreen", a) });
 * <div ref={fs.ref}><button onClick={() => fs.enter()}>expand</button></div>
 */
export function useFullscreen(options?: UseFullscreenOptions): FullscreenControls {
	const [el, setEl] = createSignal<HTMLElement>();
	const [active, setActive] = createSignal(false);
	const supported = typeof document !== "undefined" && document.fullscreenEnabled === true;

	onMount(() => {
		const read = () => {
			const a = !!document.fullscreenElement;
			setActive(a);
			options?.onChange?.(a);
		};
		read();
		document.addEventListener("fullscreenchange", read);
		onCleanup(() => document.removeEventListener("fullscreenchange", read));
	});

	return {
		ref: setEl,
		active,
		supported,
		enter: async () => {
			await (resolve(options?.element) ?? el())?.requestFullscreen(options?.requestOptions);
		},
		exit: async () => {
			if (document.fullscreenElement) await document.exitFullscreen();
		},
	};
}
