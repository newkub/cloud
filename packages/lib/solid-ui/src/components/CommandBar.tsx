/**
 * CommandBar - inline row of action buttons.
 */
import { For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-background",
};

export interface CommandBarAction {
	id: string | number;
	label: string;
	shortcut?: string;
	onSelect?: () => void;
}

export interface CommandBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	actions?: CommandBarAction[];
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CommandBar(props: CommandBarProps) {
	const [local, rest] = splitProps(props, ["class", "children", "actions", "variant", "size", "radius", "elevation"]);

	const className = () =>
		[
			"sticky top-0 z-sticky flex flex-wrap items-center gap-1 border-b",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "xs"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} role="toolbar" aria-label="Command bar" {...rest}>
			<For each={local.actions ?? []}>
				{(action) => (
					<button
						type="button"
						class="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						onClick={() => action.onSelect?.()}
					>
						{action.label}
						{action.shortcut ? (
							<kbd class="rounded border border-border bg-muted px-1 text-[10px] text-muted-foreground">
								{action.shortcut}
							</kbd>
						) : null}
					</button>
				)}
			</For>
			{local.children}
		</div>
	);
}
