/**
 * CtaSection — call-to-action banner with title and action button.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CtaSectionProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	/** Button label. */
	actionLabel?: string;
	actionHref?: string;
	onAction?: () => void;
	/** Second, quieter action. */
	secondaryLabel?: string;
	secondaryHref?: string;
	align?: "left" | "center";
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "px-6 py-8", md: "px-8 py-12", lg: "px-10 py-16" } as const;
const titleSize = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" } as const;

export function CtaSection(props: CtaSectionProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"actionLabel",
		"actionHref",
		"onAction",
		"secondaryLabel",
		"secondaryHref",
		"align",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const centered = () => (local.align ?? "center") === "center";
	return (
		<section
			class={`solidui-cta-section ${surfaceVariants[local.variant ?? "primary"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${
				centered() ? "text-center" : ""
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={centered() ? "mx-auto max-w-xl" : "flex flex-wrap items-center justify-between gap-6"}>
				<div>
					<h2 class={`font-bold tracking-tight text-foreground ${titleSize[local.size ?? "md"]}`}>{local.title}</h2>
					<Show when={local.description}>
						<p class="mt-2 text-sm text-muted-foreground">{local.description}</p>
					</Show>
				</div>
				<Show when={local.actionLabel || local.secondaryLabel}>
					<div class={`mt-5 flex gap-3 ${centered() ? "justify-center" : "shrink-0"}`}>
						<Show when={local.secondaryLabel}>
							<a
								href={local.secondaryHref ?? "#"}
								class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								{local.secondaryLabel}
							</a>
						</Show>
						<Show when={local.actionLabel}>
							<a
								href={local.actionHref ?? "#"}
								class="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								onClick={(e) => {
									if (!local.actionHref) e.preventDefault();
									local.onAction?.();
								}}
							>
								{local.actionLabel}
							</a>
						</Show>
					</div>
				</Show>
			</div>
		</section>
	);
}
