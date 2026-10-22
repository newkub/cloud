/**
 * DotPager — dot indicators for carousels and paged content.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DotPagerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Total page count */
	count: number;
	/** Active index (0-based) */
	index?: number;
	/** Dot size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Active dot style @default "primary" */
	variant?: "primary" | "muted" | "accent";
	onChange?: (index: number) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const dotSize = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const;
const activeClass = { primary: "bg-primary", muted: "bg-foreground", accent: "bg-info" } as const;

export function DotPager(props: DotPagerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"count",
		"index",
		"size",
		"variant",
		"onChange",
		"radius",
		"elevation",
	]);
	const active = () => local.index ?? 0;
	return (
		<div
			role="tablist"
			aria-label="Pages"
			class={`solidui-dot-pager flex items-center gap-1.5 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={Array.from({ length: local.count }, (_, i) => i)}>
				{(i) => (
					<button
						type="button"
						role="tab"
						aria-selected={i === active()}
						aria-label={`Page ${i + 1}`}
						class="group flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						onClick={() => local.onChange?.(i)}
					>
						<span
							class={`rounded-full transition-all motion-reduce:transition-none ${dotSize[local.size ?? "md"]} ${
								i === active()
									? `${activeClass[local.variant ?? "primary"]} scale-110`
									: "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
							}`}
						/>
					</button>
				)}
			</For>
		</div>
	);
}
