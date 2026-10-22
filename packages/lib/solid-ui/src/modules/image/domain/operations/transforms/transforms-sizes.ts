// Image Module - Size Generation
// This module handles responsive size generation

export const DEFAULT_SCREENS = {
	xs: 375,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536,
	"2xl": 1536,
};

export const generateSizes = (screens: Record<string, number> = DEFAULT_SCREENS, sizes?: string): string => {
	if (sizes) return sizes;

	const parsed: string[] = [];
	const sorted = Object.entries(screens).sort(([, a], [, b]) => b - a);

	for (const [name, width] of sorted) {
		parsed.push(`(${name === "xs" ? "max" : "min"}-width:${width}px) ${width}px`);
	}

	parsed.push("100vw");
	return parsed.join(", ");
};

export const generateWidths = (
	baseWidth: number,
	multipliers: number[] = [16, 32, 48, 64, 96, 128, 256, 384],
): number[] => {
	return [baseWidth, ...multipliers.map((m) => Math.round(baseWidth * (m / 16)))]
		.filter((w, i, arr) => arr.indexOf(w) === i)
		.sort((a, b) => a - b);
};
