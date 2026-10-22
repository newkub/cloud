/**
 * Toggle - pressable on/off button.
 */
import { type JSX, splitProps } from "solid-js";
import { controlSizes, controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ToggleProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> {
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	value?: string;
	variant?: keyof typeof controlVariants;
	size?: keyof typeof controlSizes;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function Toggle(props: ToggleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"pressed",
		"onPressedChange",
		"onClick",
		"disabled",
		"value",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		if (local.disabled) return;
		const next = !local.pressed;
		local.onPressedChange?.(next);
		if (typeof local.onClick === "function") {
			local.onClick(e);
		}
	};

	const base =
		"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground";
	const stateClass = () => (local.pressed ? "bg-primary text-primary-foreground" : "");
	const className = () =>
		[
			base,
			local.variant ? controlVariants[local.variant] : "",
			local.size ? controlSizes[local.size] : "",
			stateClass(),
			radiusMap[local.radius ?? "md"],
			elevationMap[local.elevation ?? "sm"],
			local.fullWidth ? "w-full" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<button
			type="button"
			aria-pressed={local.pressed}
			disabled={local.disabled}
			onClick={handleClick}
			class={className()}
			{...rest}
		>
			{local.children ?? local.value}
		</button>
	);
}
