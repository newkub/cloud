import { createMemo, type JSX, onMount, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { ResizableContext } from "./context";

export interface ResizablePanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
	defaultSize?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ResizablePanel(props: ResizablePanelProps) {
	const ctx = useContext(ResizableContext);
	if (!ctx) {
		throw new Error("ResizablePanel must be used inside a Resizable.");
	}

	const [local, rest] = splitProps(props, ["class", "defaultSize", "children", "radius", "elevation"]);
	const index = ctx.getPanelIndex();
	const size = createMemo(() => ctx.sizes()[index] ?? 50);

	onMount(() => {
		if (ctx.sizes()[index] === 0) {
			ctx.setSizeAt(index, local.defaultSize ?? 50);
		}
	});

	const style = () => ({
		flex: "none",
		[ctx.direction() === "vertical" ? "height" : "width"]: `${size()}%`,
	});

	const className = () =>
		[
			"min-w-0 overflow-hidden border border-border bg-muted p-2",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} style={style()} {...rest}>
			{local.children}
		</div>
	);
}
