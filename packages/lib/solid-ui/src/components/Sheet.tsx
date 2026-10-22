/**
 * Sheet - edge-attached dialog panel with title.
 */
import { type JSX, mergeProps, Show } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { OverlayPanel, type OverlaySide } from "./OverlayPanel";

export type SheetSide = OverlaySide;

export interface SheetProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	side?: SheetSide;
	children?: JSX.Element;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Extra corner radius (edge-side corners stay directional). */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Sheet(props: SheetProps) {
	const merged = mergeProps({ open: false, side: "bottom" as SheetSide }, props);
	return (
		<Show when={merged.open}>
			<OverlayPanel
				idPrefix="sheet"
				defaultSide="bottom"
				onOpenChange={merged.onOpenChange}
				title={merged.title}
				description={merged.description}
				side={merged.side}
				variant={merged.variant}
				size={merged.size}
				radius={merged.radius}
				elevation={merged.elevation}
				class={merged.class}
			>
				{merged.children}
			</OverlayPanel>
		</Show>
	);
}
