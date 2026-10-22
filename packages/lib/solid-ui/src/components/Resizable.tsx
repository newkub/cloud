/**
 * Resizable panel with drag handle — `Panel`/`Handle` live in `./resizable/`
 * and are re-exported here so `from "./Resizable"` keeps working.
 */
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { ResizableContext, type ResizableContextValue } from "./resizable/context";

export { ResizableHandle, type ResizableHandleProps } from "./resizable/handle";
export { ResizablePanel, type ResizablePanelProps } from "./resizable/panel";

export interface ResizableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onResize"> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	direction?: "horizontal" | "vertical";
	onResize?: (sizes: number[]) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Resizable(props: ResizableProps) {
	const merged = mergeProps({ direction: "horizontal" as const }, props);
	const [local, rest] = splitProps(merged, ["class", "variant", "size", "direction", "onResize", "children"]);
	const [sizes, setSizes] = createSignal<number[]>([]);
	const [container, setContainer] = createSignal<HTMLDivElement>();
	let panelCounter = 0;
	let handleCounter = 0;

	const setSizeAt = (index: number, value: number) => {
		setSizes((prev) => {
			const next = [...prev];
			while (next.length <= index) next.push(0);
			next[index] = value;
			return next;
		});
	};

	const context: ResizableContextValue = {
		direction: () => local.direction,
		sizes,
		setSizeAt,
		getPanelIndex: () => panelCounter++,
		getHandleIndex: () => handleCounter++,
		onResize: local.onResize,
		container,
	};

	const className = () =>
		[
			"flex h-64 w-full gap-1",
			local.direction === "vertical" ? "flex-col" : "flex-row",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			props.radius ? radiusMap[props.radius] : "",
			props.elevation ? elevationMap[props.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<ResizableContext.Provider value={context}>
			<div class={className()} ref={setContainer} {...rest}>
				{local.children}
			</div>
		</ResizableContext.Provider>
	);
}
