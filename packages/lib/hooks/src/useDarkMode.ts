import { type Accessor, createEffect, createMemo, createSignal, getOwner, onCleanup, onMount } from "solid-js";

export interface DarkModeControls {
	/** Current dark state — system or overridden */
	dark: Accessor<boolean>;
	/** Explicitly enable/disable dark mode (stops following the system) */
	set: (v: boolean) => void;
	/** Whether `dark` currently tracks `prefers-color-scheme` */
	followSystem: Accessor<boolean>;
	/** Resume/stop tracking the system preference */
	setFollowSystem: (v: boolean) => void;
	/** Keep the `dark` class on <html> in sync — call once at app root */
	applyToDocument: () => void;
}

/**
 * `prefers-color-scheme: dark` as a signal with manual override.
 * `set(v)` switches to manual control; `setFollowSystem(true)` resumes
 * tracking the system preference.
 *
 * @returns `{ dark, set, followSystem, setFollowSystem, applyToDocument }` controls
 *
 * @example
 * const theme = useDarkMode();
 * <button onClick={() => theme.set(!theme.dark())}>{theme.dark() ? "☀" : "🌙"}</button>
 * <button onClick={() => theme.setFollowSystem(true)}>match system</button>
 */
export function useDarkMode(): DarkModeControls {
	const [system, setSystem] = createSignal(false);
	const [manual, setManual] = createSignal(false);
	const [follow, setFollow] = createSignal(true);
	const dark = createMemo(() => (follow() ? system() : manual()));

	onMount(() => {
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		setSystem(mql.matches);
		const read = (e: MediaQueryListEvent) => setSystem(e.matches);
		mql.addEventListener("change", read);
		onCleanup(() => mql.removeEventListener("change", read));
	});

	return {
		dark,
		set: (v) => {
			setManual(v);
			setFollow(false);
		},
		followSystem: follow,
		setFollowSystem: setFollow,
		applyToDocument: () => {
			if (typeof document === "undefined") return;
			const apply = () => document.documentElement.classList.toggle("dark", dark());
			// Reactive sync when called inside a component/root; one-shot otherwise.
			if (getOwner()) createEffect(apply);
			else apply();
		},
	};
}
