/**
 * TestimonialCard — quote card with author identity and optional star rating.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { AvatarName } from "./AvatarName";
import { Card, CardContent } from "./Card";

export interface TestimonialCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "role"> {
	/** Quote text */
	quote: string;
	/** Author display name */
	author: string;
	/** Author role/company line */
	role?: string;
	/** Author avatar URL */
	avatar?: string;
	/** Star rating 0–5 */
	rating?: number;
	/** Company/product name shown small above the quote */
	source?: string;
	/** Emphasized border/elevation @default false */
	featured?: boolean;
	/** Card visual variant @default "default" */
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Card content density */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const Star = (p: { filled: boolean }) => (
	<svg
		viewBox="0 0 24 24"
		class={`h-4 w-4 ${p.filled ? "fill-warning text-warning" : "fill-none text-muted-foreground/40"}`}
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"
	>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

export function TestimonialCard(props: TestimonialCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"quote",
		"author",
		"role",
		"avatar",
		"rating",
		"source",
		"featured",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<Card
			variant={local.variant}
			class={`solidui-testimonial-card ${local.featured ? "border-primary/40 shadow-md" : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<CardContent class="pt-6" size={local.size}>
				<Show when={local.rating !== undefined}>
					<div class="mb-3 flex gap-0.5" role="img" aria-label={`${local.rating} out of 5 stars`}>
						<For each={Array.from({ length: 5 })}>{(_, i) => <Star filled={i() < (local.rating ?? 0)} />}</For>
					</div>
				</Show>
				<Show when={local.source}>
					<p class="mb-1 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">{local.source}</p>
				</Show>
				<blockquote class="text-sm leading-relaxed text-foreground">“{local.quote}”</blockquote>
				<div class="mt-4">
					<AvatarName name={local.author} src={local.avatar} subtitle={local.role} size="sm" />
				</div>
			</CardContent>
		</Card>
	);
}
