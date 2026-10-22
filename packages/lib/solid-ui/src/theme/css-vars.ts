import { colorSchemes } from "./colors";
import { adjustLightness } from "./hsl";
import { fontStacks, radiusScales, spaceScales } from "./scales";
import type { ColorSet, ThemeColor, ThemeMode, ThemeState } from "./types";

/** Same lightness adjustments applyThemeState uses at runtime. */
export function varsForMode(colorSet: ColorSet, mode: ThemeMode): Record<string, string> {
	const baseForeground = mode === "dark" ? "222 47% 11%" : "0 0% 100%";
	const primaryShift = mode === "dark" ? -5 : 5;
	const surfaceShift = mode === "dark" ? 5 : -5;
	return {
		"--color-primary": colorSet.primary,
		"--color-primary-foreground": colorSet.primaryForeground,
		"--color-primary-hover": adjustLightness(colorSet.primary, primaryShift),
		"--color-primary-active": adjustLightness(colorSet.primary, primaryShift * 2),
		"--color-secondary": colorSet.secondary,
		"--color-secondary-foreground": colorSet.secondaryForeground,
		"--color-secondary-hover": adjustLightness(colorSet.secondary, surfaceShift),
		"--color-secondary-active": adjustLightness(colorSet.secondary, surfaceShift * 2),
		"--color-accent": colorSet.accent,
		"--color-accent-foreground": colorSet.accentForeground,
		"--color-accent-hover": adjustLightness(colorSet.accent, surfaceShift),
		"--color-accent-active": adjustLightness(colorSet.accent, surfaceShift * 2),
		"--color-ring": colorSet.ring,
		"--color-info": colorSet.info,
		"--color-info-foreground": baseForeground,
		"--color-success": colorSet.success,
		"--color-success-foreground": baseForeground,
		"--color-warning": colorSet.warning,
		"--color-warning-foreground": baseForeground,
		"--color-destructive": colorSet.destructive,
		"--color-destructive-foreground": baseForeground,
		"--color-destructive-hover": adjustLightness(colorSet.destructive, primaryShift),
		"--color-destructive-active": adjustLightness(colorSet.destructive, primaryShift * 2),
	};
}

export function varsForState(state: Pick<ThemeState, "font" | "space" | "radius">): Record<string, string> {
	const vars: Record<string, string> = { "--su-font-sans": fontStacks[state.font] };
	for (const [key, value] of Object.entries(spaceScales[state.space])) {
		vars[`--su-space-${key}`] = value;
	}
	const radius = radiusScales[state.radius];
	vars["--su-radius"] = radius.DEFAULT;
	vars["--su-radius-sm"] = radius.sm;
	vars["--su-radius-md"] = radius.md;
	vars["--su-radius-lg"] = radius.lg;
	vars["--su-radius-xl"] = radius.xl;
	vars["--su-radius-full"] = "9999px";
	return vars;
}

const block = (selector: string, vars: Record<string, string>) =>
	`${selector} {\n${Object.entries(vars)
		.map(([k, v]) => `\t${k}: ${v};`)
		.join("\n")}\n}`;

/**
 * Emit a complete theme.css for a ThemeState — light vars on :root, dark vars
 * under [data-theme="dark"], plus the font/space/radius tokens on :root.
 */
export function cssVarsForTheme(state: ThemeState, color?: Exclude<ThemeColor, "auto">): string {
	const resolved = color ?? (state.color === "auto" ? "blue" : state.color);
	const scheme = colorSchemes[resolved];
	return [
		`/* solid-ui theme — color:${resolved} font:${state.font} space:${state.space} radius:${state.radius} */`,
		block(":root", { ...varsForMode(scheme.light, "light"), ...varsForState(state) }),
		block('[data-theme="dark"]', varsForMode(scheme.dark, "dark")),
		"",
	].join("\n");
}
