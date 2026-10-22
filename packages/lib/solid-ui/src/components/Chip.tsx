/**
 * Chip - compact selectable/removable filter element.
 */
import { type JSX, splitProps } from "solid-js";
import { chipVariants, controlSizes, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap: Record<string, string> = {
	default: "bg-muted text-foreground hover:bg-muted/80",
	primary: "bg-primary text-primary-foreground hover:bg-primary/90",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	outline: "bg-transparent border-input text-foreground hover:bg-accent",
	success: chipVariants.success,
	warning: chipVariants.warning,
	destructive: chipVariants.destructive,
};

export interface ChipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "destructive";
	size?: keyof typeof controlSizes;
	selected?: boolean;
	disabled?: boolean;
	onRemove?: () => void;
	removeLabel?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Chip(props: ChipProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"size",
		"selected",
		"disabled",
		"onRemove",
		"removeLabel",
		"radius",
		"elevation",
	]);

	const base = "inline-flex items-center gap-1 border px-2.5 py-0.5 text-xs font-medium transition-colors";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			local.size ? controlSizes[local.size] : "",
			local.selected ? "ring-1 ring-primary" : "",
			local.disabled ? "pointer-events-none opacity-50" : "",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<span class={className()} aria-disabled={local.disabled} {...rest}>
			{local.children}
			{local.onRemove && !local.disabled && (
				<button
					type="button"
					onClick={local.onRemove}
					aria-label={local.removeLabel ?? "Remove chip"}
					class="-my-1.5 -ml-1 -mr-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-current transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					×
				</button>
			)}
		</span>
	);
}
