/**
 * DensityToggle — compact/comfortable density switcher (segmented control).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type Density = "compact" | "comfortable" | "spacious";

export interface DensityToggleProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	value: Density;
	onChange?: (density: Density) => void;
	/** Subset of densities to offer. @default all three */
	options?: Density[];
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const DENSITY_LABEL: Record<Density, string> = {
	compact: "Compact",
	comfortable: "Comfortable",
	spacious: "Spacious",
};

const DENSITY_ICON: Record<Density, string> = {
	compact: "M4 6h16M4 10h16M4 14h16M4 18h16",
	comfortable: "M4 7h16M4 12h16M4 17h16",
	spacious: "M4 8h16M4 16h16",
};

const btnSize = { sm: "h-6 px-2 text-2xs", md: "h-7 px-2.5 text-xs", lg: "h-8 px-3 text-sm" } as const;

export function DensityToggle(props: DensityToggleProps) {
	const [local, rest] = splitProps(props, ["class", "value", "onChange", "options", "size", "radius", "disabled"]);
	return (
		<div
			role="radiogroup"
			aria-label="Density"
			class={`solidui-density-toggle inline-flex items-center border border-border bg-muted/40 p-0.5 ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.options ?? (["compact", "comfortable", "spacious"] as Density[])}>
				{(d) => (
					// biome-ignore lint/a11y/useSemanticElements: radio pattern inside radiogroup
					<button
						type="button"
						role="radio"
						aria-checked={local.value === d}
						disabled={local.disabled}
						class={`inline-flex items-center gap-1 font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${btnSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${
							local.value === d ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => local.onChange?.(d)}
					>
						<svg
							class="h-3 w-3"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d={DENSITY_ICON[d]} stroke-linecap="round" />
						</svg>
						{DENSITY_LABEL[d]}
					</button>
				)}
			</For>
		</div>
	);
}
