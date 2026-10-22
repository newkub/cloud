/**
 * BubbleMenu - floating toolbar shown near a text selection (editor pattern).
 * Render it absolutely positioned; parent controls visibility + coordinates.
 */
import { For, type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BubbleMenuAction {
	/** Action id passed to onAction. */
	id: string;
	/** Accessible label. */
	label: string;
	/** Icon name or custom JSX. */
	icon?: JSX.Element | string;
	/** Highlighted active state (e.g. bold already applied). @default false */
	active?: boolean;
}

export interface BubbleMenuProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Toolbar actions. */
	actions: BubbleMenuAction[];
	/** Called with the picked action id. */
	onAction?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BubbleMenu(props: BubbleMenuProps) {
	const [local, rest] = splitProps(props, ["class", "actions", "onAction", "radius", "elevation"]);

	const className = () =>
		[
			"solidui-bubble-menu inline-flex items-center gap-0.5 border border-border bg-popover p-1 motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			radiusMap[local.radius ?? "md"],
			elevationMap[local.elevation ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} role="toolbar" {...rest}>
			<For each={local.actions}>
				{(a) => (
					<button
						type="button"
						class={`inline-flex h-7 w-7 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							a.active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
						}`}
						aria-label={a.label}
						aria-pressed={a.active ?? false}
						title={a.label}
						onClick={() => local.onAction?.(a.id)}
					>
						{typeof a.icon === "string" ? <NamedIcon name={a.icon} class="h-4 w-4" /> : (a.icon ?? a.label)}
					</button>
				)}
			</For>
		</div>
	);
}
