/**
 * Tooltip - hover hint bubble anchored to a trigger.
 */
import { createSignal, type JSX, mergeProps, Show } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

let tooltipCount = 0;

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface text-foreground shadow-md",
};

export interface TooltipProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: JSX.Element;
	content?: JSX.Element;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Tooltip(props: TooltipProps) {
	const merged = mergeProps({ open: undefined as boolean | undefined }, props);
	const [internal, setInternal] = createSignal(false);
	const id = `tooltip-${++tooltipCount}`;

	const controlled = () => merged.open !== undefined;
	const open = () => (controlled() ? merged.open === true : internal());
	const setOpen = (v: boolean) => {
		if (!controlled()) setInternal(v);
		merged.onOpenChange?.(v);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tooltip wrapper relays hover/focus to the popup; the trigger inside carries semantics
		<div
			class={`relative inline-block ${merged.radius ? radiusMap[merged.radius] : ""} ${merged.elevation ? elevationMap[merged.elevation] : ""} ${merged.class ?? ""}`}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onFocusIn={() => setOpen(true)}
			onFocusOut={() => setOpen(false)}
			onKeyDown={(e) => {
				if (e.key === "Escape") setOpen(false);
			}}
		>
			{merged.children}
			<Show when={open()}>
				<div
					id={id}
					role="tooltip"
					class="absolute bottom-full left-1/2 z-tooltip mb-2 -translate-x-1/2 motion-safe:animate-[su-fade-in_var(--su-transition-fast)]"
				>
					<div
						class={`max-w-[calc(100vw-2rem)] truncate rounded-md border px-3 py-1.5 text-sm ${variantMap[merged.variant ?? "default"]}`}
					>
						{merged.content}
					</div>
					<div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-surface" />
				</div>
			</Show>
		</div>
	);
}
