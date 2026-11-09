import {
	cssVarsForTheme,
	type ThemeColor,
	type ThemeState,
} from "@wrikka/theme";

export type ThemeMode = "dark" | "light";
export type Accent = Extract<
	ThemeColor,
	"green" | "blue" | "violet" | "orange"
>;

export interface Prefs {
	mode: ThemeMode;
	accent: Accent;
	reducedMotion: boolean;
}

const PREFS_KEY = "cloud:prefs";

const ACCENT_RGB: Record<Accent, string> = {
	green: "52 211 153",
	blue: "96 165 250",
	violet: "167 139 250",
	orange: "251 146 60",
};

const DEFAULTS: Prefs = {
	mode: "dark",
	accent: "green",
	reducedMotion: false,
};

export function loadPrefs(): Prefs {
	try {
		const raw = localStorage.getItem(PREFS_KEY);
		if (!raw) {
			return { ...DEFAULTS };
		}
		const parsed = JSON.parse(raw) as Partial<Prefs>;
		return {
			mode: parsed.mode === "light" ? "light" : "dark",
			accent:
				parsed.accent && parsed.accent in ACCENT_RGB
					? (parsed.accent as Accent)
					: DEFAULTS.accent,
			reducedMotion: parsed.reducedMotion === true,
		};
	} catch {
		return { ...DEFAULTS };
	}
}

export function savePrefs(next: Prefs): Prefs {
	localStorage.setItem(PREFS_KEY, JSON.stringify(next));
	applyPrefs(next);
	return next;
}

export function applyPrefs(prefs: Prefs) {
	if (typeof document === "undefined") {
		return;
	}
	const root = document.documentElement;
	root.dataset.theme = prefs.mode;
	root.dataset.motion = prefs.reducedMotion ? "reduced" : "full";
	root.style.setProperty("--acc", ACCENT_RGB[prefs.accent]);

	const state: ThemeState = {
		name: "wrikka",
		mode: prefs.mode,
		color: prefs.accent,
		font: "sans",
		space: "normal",
		radius: "medium",
	};
	let style = document.getElementById("solidui-runtime-theme");
	if (!style) {
		style = document.createElement("style");
		style.id = "solidui-runtime-theme";
		document.head.append(style);
	}
	style.textContent = cssVarsForTheme(state);
}
