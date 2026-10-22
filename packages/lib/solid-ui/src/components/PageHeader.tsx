/**
 * PageHeader — breadcrumb trail + page title, description, and action slot.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PageHeaderProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Page title */
	title: string;
	/** Supporting line under the title */
	description?: string;
	/** Breadcrumb trail rendered above the title */
	breadcrumbs?: { label: string; href?: string }[];
	/** Right-aligned actions slot */
	actions?: JSX.Element;
	/** Title size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const titleSize = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" } as const;

export function PageHeader(props: PageHeaderProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"breadcrumbs",
		"actions",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<header
			class={`solidui-page-header space-y-1.5 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.breadcrumbs?.length}>
				<nav aria-label="Breadcrumb" class="text-xs text-muted-foreground">
					<ol class="flex flex-wrap items-center gap-1.5">
						<For each={local.breadcrumbs}>
							{(crumb, i) => (
								<li class="flex items-center gap-1.5">
									<Show when={i() > 0}>
										<span class="text-border" aria-hidden="true">
											/
										</span>
									</Show>
									{crumb.href ? (
										<a
											href={crumb.href}
											class="rounded-sm transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											aria-current={i() === (local.breadcrumbs?.length ?? 0) - 1 ? "page" : undefined}
										>
											{crumb.label}
										</a>
									) : (
										<span
											class="text-foreground"
											aria-current={i() === (local.breadcrumbs?.length ?? 0) - 1 ? "page" : undefined}
										>
											{crumb.label}
										</span>
									)}
								</li>
							)}
						</For>
					</ol>
				</nav>
			</Show>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="min-w-0">
					<h1 class={`font-bold tracking-tight ${titleSize[local.size ?? "md"]}`}>{local.title}</h1>
					<Show when={local.description}>
						<p class="mt-1 text-sm text-muted-foreground">{local.description}</p>
					</Show>
				</div>
				<Show when={local.actions}>
					<div class="flex shrink-0 items-center gap-2">{local.actions}</div>
				</Show>
			</div>
		</header>
	);
}
