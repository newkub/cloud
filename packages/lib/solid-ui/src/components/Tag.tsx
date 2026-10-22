/**
 * Tag - removable label chip.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap: Record<string, string> = {
	default: "bg-primary text-primary-foreground hover:bg-primary/90",
	primary: "bg-primary text-primary-foreground hover:bg-primary/90",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	success: "bg-success text-success-foreground hover:bg-success/90",
	warning: "bg-warning text-warning-foreground hover:bg-warning/90",
	destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
	outline: "bg-transparent border-input text-foreground hover:bg-accent",
};

const sizeMap: Record<string, string> = {
	sm: "px-2 py-0.5 text-2xs",
	md: "px-2.5 py-0.5 text-xs",
	lg: "px-3 py-1 text-sm",
};

export interface TagProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";
	size?: "sm" | "md" | "lg";
	onRemove?: () => void;
	removeLabel?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Tag(props: TagProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"size",
		"onRemove",
		"removeLabel",
		"radius",
		"elevation",
	]);

	const base = "inline-flex items-center gap-1 border font-semibold transition-colors";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "full"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<span class={className()} {...rest}>
			{local.children}
			{local.onRemove && (
				<button
					type="button"
					onClick={local.onRemove}
					aria-label={local.removeLabel ?? "Remove tag"}
					class="-my-1.5 -ml-1 -mr-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-current transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					×
				</button>
			)}
		</span>
	);
}
