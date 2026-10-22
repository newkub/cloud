/**
 * Snackbar - transient bottom message with optional action.
 */
import { createEffect, type JSX, onCleanup, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type StatusVariant,
	statusVariants,
} from "../lib/variants";

const variantMap: Record<StatusVariant, string> = {
	...statusVariants,
	default: "border-transparent bg-foreground text-background",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: paddingSizes.sm,
	md: "px-4 py-2.5",
	lg: paddingSizes.lg,
};

export interface SnackbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: StatusVariant;
	size?: "sm" | "md" | "lg";
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	duration?: number;
	action?: JSX.Element;
	actionLabel?: string;
	onAction?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Snackbar(props: SnackbarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"size",
		"open",
		"onOpenChange",
		"duration",
		"action",
		"actionLabel",
		"onAction",
		"radius",
		"elevation",
	]);

	let timer: ReturnType<typeof setTimeout> | undefined;

	createEffect(() => {
		clearTimeout(timer);
		if (local.open !== false && local.duration !== undefined && local.duration > 0) {
			timer = setTimeout(() => local.onOpenChange?.(false), local.duration);
		}
	});
	onCleanup(() => clearTimeout(timer));

	const base =
		"fixed bottom-4 left-1/2 z-toast flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 border text-sm mb-[env(safe-area-inset-bottom)] motion-safe:animate-[su-slide-up_var(--su-transition-normal)]";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			elevationMap[local.elevation ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={local.open !== false}>
			<div class={className()} role="status" {...rest}>
				<span>{local.children}</span>
				<Show when={local.action ?? local.actionLabel}>
					<button
						type="button"
						class="-my-1.5 min-h-9 rounded px-3 py-1 text-xs font-medium text-primary-foreground/90 transition-colors hover:bg-background/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background"
						onClick={() => local.onAction?.()}
					>
						{local.action ?? local.actionLabel}
					</button>
				</Show>
			</div>
		</Show>
	);
}
