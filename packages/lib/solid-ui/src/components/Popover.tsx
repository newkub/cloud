/**
 * Popover - anchored floating content panel.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { type JSX, mergeProps, Show } from "solid-js";
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
	default: "border-border bg-surface shadow-md",
};

export interface PopoverProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
	content?: JSX.Element;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Popover(props: PopoverProps) {
	const merged = mergeProps({ open: false }, props);

	useEscapeKey(() => merged.onOpenChange?.(false), { when: () => merged.open });

	return (
		<div
			class={`relative inline-block ${merged.radius ? radiusMap[merged.radius] : ""} ${merged.elevation ? elevationMap[merged.elevation] : ""} ${merged.class ?? ""}`}
		>
			{merged.children}
			<Show when={merged.open}>
				<div
					role="dialog"
					class={`absolute left-0 top-full z-popover mt-2 w-56 max-w-[calc(100vw-1rem)] rounded-xl border motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${variantMap[merged.variant ?? "default"]} ${paddingSizes[merged.size ?? "md"]}`}
				>
					{merged.content}
				</div>
			</Show>
		</div>
	);
}
