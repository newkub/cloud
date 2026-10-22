/**
 * HeroSection — landing page hero: title, subtitle, CTAs.
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

export interface HeroAction {
	label: string;
	href?: string;
	onClick?: () => void;
}

export interface HeroSectionProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	subtitle?: string;
	/** Eyebrow/kicker line above the title. */
	kicker?: string;
	primaryAction?: HeroAction;
	secondaryAction?: HeroAction;
	/** Text alignment. @default "center" */
	align?: "left" | "center";
	/** Media slot rendered beside/below the text (align="left" puts it right). */
	media?: JSX.Element;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "px-6 py-10", md: "px-8 py-16", lg: "px-10 py-24" } as const;
const titleSize = { sm: "text-2xl", md: "text-4xl", lg: "text-5xl" } as const;

const ActionButton = (props: { action?: HeroAction; primary?: boolean; size: "sm" | "md" | "lg" }) => (
	<Show when={props.action}>
		{(a) => (
			<a
				href={a().href ?? "#"}
				class={`inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
					props.primary
						? "bg-primary text-primary-foreground hover:bg-primary/90"
						: "border border-border bg-transparent text-foreground hover:bg-muted"
				}`}
				onClick={(e) => {
					if (!a().href) e.preventDefault();
					a().onClick?.();
				}}
			>
				{a().label}
			</a>
		)}
	</Show>
);

export function HeroSection(props: HeroSectionProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"subtitle",
		"kicker",
		"primaryAction",
		"secondaryAction",
		"align",
		"media",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const centered = () => (local.align ?? "center") === "center";
	const size = () => local.size ?? "md";
	return (
		<section
			class={`solidui-hero-section ${surfaceVariants[local.variant ?? "default"]} ${pad[size()]} ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={centered() ? "mx-auto max-w-2xl text-center" : "grid items-center gap-8 lg:grid-cols-2"}>
				<div class={centered() ? "" : "max-w-xl"}>
					<Show when={local.kicker}>
						<p class="mb-2 text-2xs font-semibold uppercase tracking-widest text-primary">{local.kicker}</p>
					</Show>
					<h1 class={`font-bold tracking-tight text-foreground ${titleSize[size()]}`}>{local.title}</h1>
					<Show when={local.subtitle}>
						<p class={`mt-4 text-muted-foreground ${size() === "lg" ? "text-lg" : "text-base"}`}>{local.subtitle}</p>
					</Show>
					<Show when={local.primaryAction || local.secondaryAction}>
						<div class={`mt-6 flex gap-3 ${centered() ? "justify-center" : ""}`}>
							<ActionButton action={local.primaryAction} primary size={size()} />
							<ActionButton action={local.secondaryAction} size={size()} />
						</div>
					</Show>
				</div>
				<Show when={!centered() && local.media}>
					<div class="min-w-0">{local.media}</div>
				</Show>
			</div>
			<Show when={centered() && local.media}>
				<div class="mx-auto mt-10 max-w-3xl">{local.media}</div>
			</Show>
		</section>
	);
}
