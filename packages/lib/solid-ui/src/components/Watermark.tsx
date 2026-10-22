/**
 * Watermark — tiled text/logo overlay rendered behind content.
 */
import { type JSX, splitProps } from "solid-js";

export interface WatermarkProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Repeated text, e.g. "CONFIDENTIAL" or "© company". */
	text?: string;
	/** Image URL — used instead of text when provided. */
	image?: string;
	/** Tile rotation in degrees. @default -20 */
	rotate?: number;
	/** Tile opacity 0–1. @default 0.08 */
	opacity?: number;
	/** Horizontal/vertical gap between tiles (px). @default 120x80 */
	gap?: [number, number];
	/** Font size of the text tile. @default "0.9rem" */
	fontSize?: string;
	/** Content rendered above the watermark. */
	children?: JSX.Element;
}

export function Watermark(props: WatermarkProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"text",
		"image",
		"rotate",
		"opacity",
		"gap",
		"fontSize",
		"children",
	]);
	const tile = () => {
		const w = local.gap?.[0] ?? 120;
		const h = local.gap?.[1] ?? 80;
		const inner = local.image
			? `<image href="${local.image}" x="0" y="0" width="60" height="60"/>`
			: `<text x="0" y="${local.fontSize ?? "0.9rem"}" fill="currentColor" font-size="${local.fontSize ?? "0.9rem"}">${local.text ?? ""}</text>`;
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><g transform='rotate(${local.rotate ?? -20} ${w / 2} ${h / 2}) translate(${w / 4} ${h / 2})' opacity='${local.opacity ?? 0.08}'>${inner}</g></svg>`;
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
	};
	return (
		<div class={`solidui-watermark relative ${local.class ?? ""}`.trim()} {...rest}>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 z-0 text-foreground"
				style={{ "background-image": tile() }}
			/>
			<div class="relative z-10">{local.children}</div>
		</div>
	);
}
