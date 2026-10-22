/**
 * TruncatedText — ellipsis truncation (single or multi-line clamp) with title tooltip.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TruncatedTextProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Text content */
	text: string;
	/** Clamp to N lines — 1 gives single-line ellipsis @default 1 */
	lines?: number;
	/** Disable the native tooltip @default false */
	noTooltip?: boolean;
	/** Tooltip text — defaults to `text` */
	tooltip?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TruncatedText(props: TruncatedTextProps) {
	const [local, rest] = splitProps(props, ["class", "text", "lines", "noTooltip", "tooltip", "radius", "elevation"]);
	const title = () => (local.noTooltip ? undefined : (local.tooltip ?? local.text));
	const multi = () => (local.lines ?? 1) > 1;
	return (
		<span
			class={`solidui-truncated-text max-w-full ${multi() ? "overflow-hidden text-ellipsis" : "block truncate"} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			style={
				multi()
					? {
							display: "-webkit-box",
							"-webkit-line-clamp": String(local.lines),
							"-webkit-box-orient": "vertical",
						}
					: undefined
			}
			title={title()}
			{...rest}
		>
			{local.text}
		</span>
	);
}
