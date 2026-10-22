import { type SurfaceVariant, surfaceVariants } from "../../lib/variants";

export const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

export const cellPadding: Record<"sm" | "md" | "lg", string> = {
	sm: "px-3 py-2",
	md: "px-4 py-3",
	lg: "px-6 py-4",
};

export function sortIcon(state: "asc" | "desc" | false) {
	if (state === "asc") return "↑";
	if (state === "desc") return "↓";
	return "⇅";
}
