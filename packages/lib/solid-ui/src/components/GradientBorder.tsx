/**
 * GradientBorder - wrapper that renders an animated conic-gradient border around its content.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface GradientBorderProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Seconds per gradient revolution. @default 4 */
	speed?: number;
	/** Border thickness in px. @default 1 */
	width?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const GRADIENT =
	"conic-gradient(from 0deg, transparent 0deg, hsl(var(--color-primary)) 120deg, hsl(var(--color-info)) 240deg, transparent 360deg)";

export function GradientBorder(props: GradientBorderProps) {
	const [local, restProps] = splitProps(props, ["children", "speed", "width", "style"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-gradient-border relative overflow-hidden",
		axes: [
			{ prop: "radius", map: radiusMap, default: "xl" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const pad = () => `${local.width ?? 1}px`;
	const mergedStyle = (): JSX.CSSProperties | string => {
		const s = local.style;
		if (typeof s === "string") return `padding:${pad()};${s}`;
		return { padding: pad(), ...(s ?? {}) };
	};

	return (
		<div class={className()} style={mergedStyle()} {...rest}>
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-[-100%] motion-safe:animate-spin motion-reduce:animate-none"
				style={{ "animation-duration": `${local.speed ?? 4}s`, background: GRADIENT }}
			/>
			<div class={`relative h-full ${props.unstyled ? "" : "rounded-[inherit] bg-card text-card-foreground"}`}>
				{local.children}
			</div>
		</div>
	);
}
