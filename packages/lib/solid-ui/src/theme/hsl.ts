export function hsl(h: number, s: number, l: number): string {
	return `${h} ${s}% ${l}%`;
}

/** Shift the lightness channel of an "h s% l%" string, clamped to 0–100. */
export function adjustLightness(hslValue: string, delta: number): string {
	const match = hslValue.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
	if (!match) return hslValue;
	const [h, s, l] = match.slice(1).map(Number);
	return `${h} ${s}% ${Math.max(0, Math.min(100, l + delta))}%`;
}
