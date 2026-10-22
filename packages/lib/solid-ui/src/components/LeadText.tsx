/**
 * LeadText — large lead paragraph for page/section intros.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface LeadTextProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
	/** Text size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Tone @default "muted" */
	variant?: "muted" | "default";
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = { sm: "text-base", md: "text-lg", lg: "text-xl" } as const;

export function LeadText(props: LeadTextProps) {
	const [local, rest] = splitProps(props, ["class", "children", "size", "variant", "radius"]);
	return (
		<p
			class={`solidui-lead ${sizeClass[local.size ?? "md"]} leading-relaxed ${local.variant === "default" ? "text-foreground" : "text-muted-foreground"} ${local.radius ? radiusMap[local.radius] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</p>
	);
}
