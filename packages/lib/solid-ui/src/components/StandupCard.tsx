/**
 * StandupCard - daily standup card with yesterday / today / blockers sections; blockers are highlighted.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface StandupCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card heading. */
	title?: string;
	/** Author name shown beside the title. */
	author?: string;
	/** Completed items. */
	yesterday?: string[];
	/** Planned items. */
	today?: string[];
	/** Blocking items — highlighted when present. */
	blockers?: string[];
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function StandupCard(props: StandupCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-standup-card flex flex-col gap-3 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["title", "author", "yesterday", "today", "blockers"]);

	const blockers = () => local.blockers ?? [];
	const section = (label: string, items: string[] | undefined) => ({ label, items: items ?? [] });

	return (
		<div class={className()} {...rest}>
			<Show when={local.title || local.author}>
				<div class="flex items-baseline justify-between gap-2">
					<div class="font-semibold text-foreground">{local.title ?? "Standup"}</div>
					<Show when={local.author}>
						<div class="text-xs text-muted-foreground">{local.author}</div>
					</Show>
				</div>
			</Show>
			<For each={[section("Yesterday", local.yesterday), section("Today", local.today)]}>
				{(s) => (
					<section aria-label={s.label}>
						<div class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</div>
						<ul class="mt-1 flex flex-col gap-1">
							<For each={s.items} fallback={<li class="text-xs text-muted-foreground">Nothing reported</li>}>
								{(item) => (
									<li class="flex items-start gap-2 text-sm text-foreground">
										<span aria-hidden="true" class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
										{item}
									</li>
								)}
							</For>
						</ul>
					</section>
				)}
			</For>
			<Show when={blockers().length > 0}>
				<section aria-label="Blockers" class="rounded-md border border-destructive/30 bg-destructive/10 p-3">
					<div class="text-2xs font-semibold uppercase tracking-wide text-destructive">Blockers</div>
					<ul class="mt-1 flex flex-col gap-1">
						<For each={blockers()}>
							{(item) => (
								<li class="flex items-start gap-2 text-sm text-foreground">
									<span aria-hidden="true" class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
									{item}
								</li>
							)}
						</For>
					</ul>
				</section>
			</Show>
		</div>
	);
}
