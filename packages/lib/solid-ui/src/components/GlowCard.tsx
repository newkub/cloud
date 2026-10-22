/**
 * GlowCard - card with a pointer-tracking glow that follows the cursor (--glow-x/--glow-y).
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface GlowCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Semantic color token used for the glow. @default "primary" */
	glow?: "primary" | "info" | "success" | "warning" | "destructive" | "accent";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const glowColor: Record<NonNullable<GlowCardProps["glow"]>, string> = {
	primary: "hsl(var(--color-primary) / 0.16)",
	info: "hsl(var(--color-info) / 0.16)",
	success: "hsl(var(--color-success) / 0.16)",
	warning: "hsl(var(--color-warning) / 0.18)",
	destructive: "hsl(var(--color-destructive) / 0.16)",
	accent: "hsl(var(--color-accent) / 0.28)",
};

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

export function GlowCard(props: GlowCardProps) {
	const [local, restProps] = splitProps(props, ["children", "glow", "onPointerMove"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-glow-card group relative overflow-hidden border p-4 transition-shadow hover:shadow-lg motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "xl" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	let el!: HTMLDivElement;

	const onMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		const rect = el.getBoundingClientRect();
		el.style.setProperty("--glow-x", `${(e.clientX - rect.left).toFixed(1)}px`);
		el.style.setProperty("--glow-y", `${(e.clientY - rect.top).toFixed(1)}px`);
		const userMove = local.onPointerMove;
		if (typeof userMove === "function") userMove(e);
		else if (Array.isArray(userMove)) userMove[0](userMove[1], e);
	};

	return (
		<div ref={el} class={className()} onPointerMove={onMove} {...rest}>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden motion-reduce:transition-none"
				style={{
					background: `radial-gradient(220px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor[local.glow ?? "primary"]}, transparent 70%)`,
				}}
			/>
			{local.children}
		</div>
	);
}
