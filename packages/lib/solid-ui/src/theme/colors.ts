import { blueFamilySchemes } from "./colors/blue-family";
import { coolSchemes } from "./colors/cool";
import { warmSchemes } from "./colors/warm";
import type { ColorScheme, ThemeColor } from "./types";

export const colorSchemes: Record<Exclude<ThemeColor, "auto">, ColorScheme> = {
	...blueFamilySchemes,
	...warmSchemes,
	...coolSchemes,
} as Record<Exclude<ThemeColor, "auto">, ColorScheme>;
