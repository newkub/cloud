/**
 * Rating - star rating input or readout.
 */
import { createSignal, For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RatingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: number;
	defaultValue?: number;
	max?: number;
	onValueChange?: (value: number) => void;
	readonly?: boolean;
	label?: string;
	variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const starColorMap: Record<string, string> = {
	default: "text-warning",
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
};

const starSizeMap: Record<string, string> = {
	sm: "text-sm",
	md: "text-lg",
	lg: "text-2xl",
};

export function Rating(props: RatingProps) {
	const merged = mergeProps({ defaultValue: 0, max: 5 }, props);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const [hovered, setHovered] = createSignal(0);
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"max",
		"onValueChange",
		"readonly",
		"label",
		"variant",
		"size",
		"onKeyDown",
		"radius",
		"elevation",
	]);

	const value = () => (local.value !== undefined ? local.value : internal());
	const display = () => (hovered() > 0 ? hovered() : value());
	const setValue = (next: number) => {
		if (local.readonly) return;
		setInternal(next);
		local.onValueChange?.(next);
	};

	const className = () =>
		[
			"inline-flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			local.readonly ? "" : "cursor-pointer",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (local.readonly || e.defaultPrevented) return;
		if (e.key === "ArrowRight" || e.key === "ArrowUp") {
			e.preventDefault();
			setValue(Math.min(merged.max, value() + 1));
		} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
			e.preventDefault();
			setValue(Math.max(0, value() - 1));
		}
	};

	return (
		<div
			class={className()}
			role="slider"
			aria-label={local.label ?? "Rating"}
			aria-valuemin={0}
			aria-valuemax={merged.max}
			aria-valuenow={value()}
			aria-readonly={local.readonly}
			tabIndex={local.readonly ? undefined : 0}
			onKeyDown={onKeyDown}
			onMouseLeave={() => setHovered(0)}
			{...rest}
		>
			<For each={Array.from({ length: merged.max }, (_, i) => i + 1)}>
				{(star) => (
					<button
						type="button"
						tabIndex={-1}
						disabled={local.readonly}
						class={`${starSizeMap[local.size ?? "md"]} leading-none transition-colors focus-visible:outline-none disabled:cursor-default`}
						classList={{
							[starColorMap[local.variant ?? "default"]]: star <= display(),
							"text-muted-foreground/40": star > display(),
						}}
						onClick={() => setValue(star)}
						onMouseEnter={() => setHovered(star)}
						aria-label={`${star} star${star === 1 ? "" : "s"}`}
					>
						★
					</button>
				)}
			</For>
		</div>
	);
}
