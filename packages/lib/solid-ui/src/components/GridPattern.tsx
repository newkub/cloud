/**
 * GridPattern - decorative repeating grid background for hero/feature sections.
 */
import { type JSX, splitProps } from "solid-js";

export interface GridPatternProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Cell size in px. @default 40 */
	cellSize?: number;
	/** Line color. @default "currentColor" */
	color?: string;
	/** Fade the pattern out toward the edges. @default true */
	fade?: boolean;
}

export function GridPattern(props: GridPatternProps) {
	const [local, rest] = splitProps(props, ["class", "cellSize", "color", "fade", "children"]);

	const className = () =>
		["solidui-grid-pattern absolute inset-0 text-muted-foreground pointer-events-none", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	const style = () => ({
		"background-image": `linear-gradient(to right, ${local.color ?? "currentColor"} 1px, transparent 1px), linear-gradient(to bottom, ${local.color ?? "currentColor"} 1px, transparent 1px)`,
		"background-size": `${local.cellSize ?? 40}px ${local.cellSize ?? 40}px`,
		opacity: "0.25",
		"mask-image": (local.fade ?? true) ? "radial-gradient(ellipse at center, black 40%, transparent 75%)" : "none",
	});

	return (
		<div class={className()} style={style()} aria-hidden="true" {...rest}>
			{local.children}
		</div>
	);
}
