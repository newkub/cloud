/**
 * Indicator - wraps children with a corner badge/dot (notification indicator).
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface IndicatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Badge content; a number shows the count, true shows a plain dot. */
	value?: number | boolean;
	/** Badge corner. @default "top-right" */
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	/** Badge tone. @default "destructive" */
	color?: "destructive" | "primary" | "success" | "warning";
}

const posMap = {
	"top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
	"top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
	"bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
	"bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
};

const colorMap = {
	destructive: "bg-destructive text-destructive-foreground",
	primary: "bg-primary text-primary-foreground",
	success: "bg-success text-success-foreground",
	warning: "bg-warning text-warning-foreground",
};

export function Indicator(props: IndicatorProps) {
	const [local, rest] = splitProps(props, ["class", "value", "position", "color", "children"]);

	const show = () => local.value !== undefined && local.value !== false && local.value !== 0;

	return (
		<div class={`solidui-indicator relative inline-flex ${local.class ?? ""}`} {...rest}>
			{local.children}
			<Show when={show()}>
				<span
					class={`absolute ${posMap[local.position ?? "top-right"]} inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium ring-2 ring-background ${colorMap[local.color ?? "destructive"]}`}
					aria-hidden="true"
				>
					{typeof local.value === "number" ? (local.value > 99 ? "99+" : local.value) : ""}
				</span>
			</Show>
		</div>
	);
}
