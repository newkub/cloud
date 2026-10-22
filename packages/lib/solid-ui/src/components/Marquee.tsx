/**
 * Marquee — infinitely scrolling content strip (logos, tags, tickers).
 */
import { children, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface MarqueeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Seconds per loop @default 30 */
	speed?: number;
	/** Pause animation while hovered @default false */
	pauseOnHover?: boolean;
	/** Scroll right-to-left instead @default false */
	reverse?: boolean;
	/** Fade edges with a gradient mask @default true */
	fade?: boolean;
	/** Gap between items (Tailwind gap class-safe number in rem) @default 3 */
	gap?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Marquee(props: MarqueeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"speed",
		"pauseOnHover",
		"reverse",
		"fade",
		"gap",
		"children",
		"radius",
		"elevation",
	]);
	const content = children(() => local.children);
	const fadeClass = "mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]";
	const reducedMotion =
		typeof window !== "undefined" &&
		typeof window.matchMedia === "function" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	return (
		<div
			class={`solidui-marquee group relative overflow-hidden ${local.fade === false ? "" : fadeClass} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div
				class={`flex w-max items-center ${local.pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`.trim()}
				style={{
					animation: reducedMotion
						? "none"
						: `su-marquee ${local.speed ?? 30}s linear infinite ${local.reverse ? "reverse" : ""}`,
					gap: `${local.gap ?? 3}rem`,
				}}
			>
				{content()}
				<div class="flex items-center" style={{ gap: `${local.gap ?? 3}rem` }} aria-hidden="true">
					{content()}
				</div>
			</div>
		</div>
	);
}
