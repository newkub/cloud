/**
 * FeatureGrid — marketing feature cards in a responsive grid.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface Feature {
	title: string;
	description?: string;
	/** Icon or media element above the title. */
	icon?: JSX.Element;
	/** Link the whole card. */
	href?: string;
}

export interface FeatureGridProps extends JSX.HTMLAttributes<HTMLElement> {
	features: Feature[];
	/** Columns at lg breakpoint. @default 3 */
	columns?: 1 | 2 | 3 | 4;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius on cards. */
	radius?: Radius;
	/** Shadow elevation on cards. */
	elevation?: Elevation;
	/** Section heading above the grid. */
	title?: string;
	subtitle?: string;
}

const cols = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;
const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function FeatureGrid(props: FeatureGridProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"features",
		"columns",
		"variant",
		"size",
		"radius",
		"elevation",
		"title",
		"subtitle",
	]);
	return (
		<section class={`solidui-feature-grid ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.title}>
				<div class="mb-6 text-center">
					<h2 class="text-xl font-semibold text-foreground">{local.title}</h2>
					<Show when={local.subtitle}>
						<p class="mt-1 text-sm text-muted-foreground">{local.subtitle}</p>
					</Show>
				</div>
			</Show>
			<div class={`grid gap-4 sm:grid-cols-2 ${cols[local.columns ?? 3]}`}>
				<For each={local.features}>
					{(f) => {
						const body = (
							<>
								<Show when={f.icon}>
									<div class="mb-2 text-primary">{f.icon}</div>
								</Show>
								<h3 class={`font-semibold text-foreground ${titleSize[local.size ?? "md"]}`}>{f.title}</h3>
								<Show when={f.description}>
									<p class="mt-1 text-xs text-muted-foreground">{f.description}</p>
								</Show>
							</>
						);
						const cls =
							`${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""}`.trim();
						return f.href ? (
							<a
								href={f.href}
								class={`${cls} block transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
							>
								{body}
							</a>
						) : (
							<div class={cls}>{body}</div>
						);
					}}
				</For>
			</div>
		</section>
	);
}
