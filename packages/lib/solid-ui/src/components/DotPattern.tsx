/**
 * DotPattern - decorative repeating dot background for hero/feature sections.
 */
import { type JSX, splitProps } from "solid-js";

export interface DotPatternProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Spacing between dots in px. @default 20 */
	spacing?: number;
	/** Dot diameter in px. @default 1.5 */
	dotSize?: number;
	/** Dot color. @default "currentColor" */
	color?: string;
	/** Fade toward the edges. @default true */
	fade?: boolean;
}

export function DotPattern(props: DotPatternProps) {
	const [local, rest] = splitProps(props, ["class", "spacing", "dotSize", "color", "fade", "children"]);

	const className = () =>
		["solidui-dot-pattern absolute inset-0 text-muted-foreground pointer-events-none", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	const spacing = () => local.spacing ?? 20;
	const style = () => ({
		"background-image": `radial-gradient(circle, ${local.color ?? "currentColor"} ${(local.dotSize ?? 1.5) / 2}px, transparent ${(local.dotSize ?? 1.5) / 2}px)`,
		"background-size": `${spacing()}px ${spacing()}px`,
		opacity: "0.3",
		"mask-image": (local.fade ?? true) ? "radial-gradient(ellipse at center, black 40%, transparent 75%)" : "none",
	});

	return (
		<div class={className()} style={style()} aria-hidden="true" {...rest}>
			{local.children}
		</div>
	);
}
