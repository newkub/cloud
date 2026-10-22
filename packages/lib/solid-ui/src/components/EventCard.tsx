/**
 * EventCard — calendar/event card: date badge, title, location, attendees.
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

export interface EventCardProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	/** Date — pass Date for auto badge, or { day, month } strings. */
	date: Date | { day: string; month: string };
	/** Time range text. */
	time?: string;
	location?: string;
	/** Avatar URLs shown stacked. */
	attendees?: string[];
	/** Status chip. */
	status?: "confirmed" | "tentative" | "canceled";
	href?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const statusCls = {
	confirmed: "bg-success/15 text-success",
	tentative: "bg-warning/15 text-warning",
	canceled: "bg-destructive/15 text-destructive",
} as const;

export function EventCard(props: EventCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"date",
		"time",
		"location",
		"attendees",
		"status",
		"href",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const badge = () =>
		local.date instanceof Date
			? {
					day: String(local.date.getDate()),
					month: local.date.toLocaleString("en-US", { month: "short" }),
				}
			: (local.date ?? { day: "", month: "" });
	const titleEl = () =>
		local.href ? (
			<a
				href={local.href}
				class={`font-semibold text-foreground hover:text-primary hover:underline ${local.size === "lg" ? "text-base" : "text-sm"}`}
			>
				{local.title}
			</a>
		) : (
			<span class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
				{local.title}
			</span>
		);
	return (
		<article
			class={`solidui-event-card flex gap-3 ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.status === "canceled" ? "opacity-60" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div
				class={`flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-border bg-muted/40 ${radiusMap[local.radius ?? "md"]}`}
			>
				<span class="text-lg font-bold leading-none text-foreground">{badge().day}</span>
				<span class="text-3xs font-medium uppercase text-muted-foreground">{badge().month}</span>
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					{titleEl()}
					<Show when={local.status}>
						<span class={`rounded-full px-1.5 py-0.5 text-3xs font-medium ${statusCls[local.status ?? "confirmed"]}`}>
							{local.status}
						</span>
					</Show>
				</div>
				<div class={`mt-1 space-y-0.5 text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
					<Show when={local.time}>
						<div class="flex items-center gap-1.5">
							<svg
								class="h-3 w-3"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M12 7v5l3 3" stroke-linecap="round" />
							</svg>
							{local.time}
						</div>
					</Show>
					<Show when={local.location}>
						<div class="flex items-center gap-1.5">
							<svg
								class="h-3 w-3"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							<span class="truncate">{local.location}</span>
						</div>
					</Show>
				</div>
				<Show when={local.attendees?.length}>
					<div class="mt-2 flex -space-x-1.5">
						<For each={local.attendees?.slice(0, 5)}>
							{(src) => <img src={src} alt="" class="h-5 w-5 rounded-full border-2 border-surface object-cover" />}
						</For>
						<Show when={(local.attendees?.length ?? 0) > 5}>
							<span class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-muted text-3xs font-medium text-muted-foreground">
								+{(local.attendees?.length ?? 0) - 5}
							</span>
						</Show>
					</div>
				</Show>
			</div>
		</article>
	);
}
