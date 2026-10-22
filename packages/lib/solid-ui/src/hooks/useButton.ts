import { splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const base =
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const variantMap: Record<string, string> = {
	default: "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
	primary: "bg-primary text-primary-foreground hover:bg-primary/90",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
	ghost: "hover:bg-accent hover:text-accent-foreground",
	link: "text-primary underline-offset-4 hover:underline",
};

const sizeMap: Record<string, string> = {
	default: "h-9 px-4 py-2",
	sm: "h-8 px-3 text-xs",
	md: "h-9 px-4 py-2",
	lg: "h-10 px-8",
	icon: "h-9 w-9",
};

export interface ButtonHookProps {
	class?: string;
	variant?: string;
	size?: string;
	radius?: Radius;
	elevation?: Elevation;
	fullWidth?: boolean;
	/** Busy state — adds pointer-blocking + dimmed classes (stripped from `rest`; set `aria-busy` yourself). */
	loading?: boolean;
	/** Disabled state — kept in `rest` for the element; also applies blocking classes for non-button elements. */
	disabled?: boolean;
	/** Strip all visual classes — keep behavior only. */
	unstyled?: boolean;
}

/**
 * Button class composer — merges base + variant + size + radius/elevation +
 * state (`loading`/`disabled`) + user class, and splits those props out of
 * `rest` for spreading onto the element. `disabled` stays in `rest` (real DOM
 * attribute); `loading` is consumed and adds `pointer-events-none opacity-70`.
 *
 * @param props — Component props (`class`, `variant`, `size`, `radius`, `elevation`, `fullWidth`, `loading`, `disabled`, `unstyled`)
 * @returns `{ className, rest }` — reactive className accessor + remaining props
 *
 * @example
 * const { className, rest } = useButton(props);
 * <button class={className()} aria-busy={props.loading || undefined} {...rest} />
 */
export function useButton(props: ButtonHookProps) {
	const [local, rest] = splitProps(props as Record<string, unknown>, [
		"class",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
		"loading",
		"unstyled",
	]);
	const className = () => {
		if (local.unstyled) return (local.class as string) || "";
		const variant = (local.variant as string) || "default";
		const size = (local.size as string) || "default";
		const loading = Boolean(local.loading);
		const disabled = Boolean((props as Record<string, unknown>).disabled);
		return [
			base,
			variantMap[variant] || variantMap.default,
			sizeMap[size] || sizeMap.default,
			radiusMap[(local.radius as Radius) ?? "md"],
			local.elevation ? elevationMap[local.elevation as Elevation] : "",
			local.fullWidth ? "w-full" : "",
			loading ? "pointer-events-none cursor-wait opacity-70" : "",
			!loading && disabled ? "pointer-events-none opacity-50" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");
	};
	return { className, rest };
}
