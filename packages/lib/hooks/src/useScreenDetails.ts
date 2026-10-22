import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ScreenDetailedLike extends EventTarget {
	readonly left: number;
	readonly top: number;
	readonly width: number;
	readonly height: number;
	readonly availLeft: number;
	readonly availTop: number;
	readonly availWidth: number;
	readonly availHeight: number;
	readonly devicePixelRatio: number;
	readonly isPrimary: boolean;
	readonly isInternal: boolean;
	readonly label: string;
}

export interface ScreenDetailsLike extends EventTarget {
	readonly screens: ReadonlyArray<ScreenDetailedLike>;
	readonly currentScreen: ScreenDetailedLike;
}

export interface ScreenDetailsState {
	/** `window.getScreenDetails` support flag (Window Management API) */
	supported: boolean;
	/** All attached screens — refreshed on `screenschange` */
	screens: Accessor<ReadonlyArray<ScreenDetailedLike>>;
	/** The screen hosting the current window — refreshed on `currentscreenchange` */
	current: Accessor<ScreenDetailedLike | undefined>;
	/** Last error message — permission denial included */
	error: Accessor<string | undefined>;
}

/**
 * Window Management API — enumerates attached displays via
 * `window.getScreenDetails()` and stays live through `screenschange` /
 * `currentscreenchange` events. `screens` stays empty where unsupported or
 * where permission is denied (see `error`).
 *
 * @returns `{ supported, screens, current, error }`
 *
 * @example
 * const sd = useScreenDetails();
 * <For each={sd.screens()}>{(s) => <li>{s.label} — {s.width}×{s.height}</li>}</For>
 */
export function useScreenDetails(): ScreenDetailsState {
	const supported =
		typeof window !== "undefined" &&
		typeof (window as { getScreenDetails?: () => Promise<ScreenDetailsLike> }).getScreenDetails === "function";
	const [screens, setScreens] = createSignal<ReadonlyArray<ScreenDetailedLike>>([]);
	const [current, setCurrent] = createSignal<ScreenDetailedLike>();
	const [error, setError] = createSignal<string>();

	onMount(() => {
		if (typeof window === "undefined") return;
		const getDetails = (window as { getScreenDetails?: () => Promise<ScreenDetailsLike> }).getScreenDetails;
		if (!getDetails) return;
		let details: ScreenDetailsLike | undefined;
		let disposed = false;
		const refresh = () => {
			if (!details || disposed) return;
			setScreens([...details.screens]);
			setCurrent(details.currentScreen);
		};
		getDetails
			.call(window)
			.then((d) => {
				if (disposed) return;
				details = d;
				refresh();
				setError(undefined);
				d.addEventListener?.("screenschange", refresh);
				d.addEventListener?.("currentscreenchange", refresh);
			})
			.catch((e) => {
				if (!disposed) setError(e instanceof Error ? e.message : "getScreenDetails failed");
			});
		onCleanup(() => {
			disposed = true;
			details?.removeEventListener?.("screenschange", refresh);
			details?.removeEventListener?.("currentscreenchange", refresh);
		});
	});

	return { supported, screens, current, error };
}
