/**
 * MaintenanceBanner — scheduled maintenance / incident notice with timeframe.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface MaintenanceBannerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	message: string;
	/** ISO or pre-formatted start/end times. */
	startsAt?: string;
	endsAt?: string;
	severity?: "info" | "warning" | "critical";
	/** "Scheduled" | "In progress" label. */
	status?: "scheduled" | "active";
	onDismiss?: () => void;
	/** Optional details link. */
	learnMoreHref?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sevCls = {
	info: "border-info/50 bg-info/10 text-info",
	warning: "border-warning/50 bg-warning/10 text-warning",
	critical: "border-destructive/50 bg-destructive/10 text-destructive",
} as const;
const pad = { sm: "p-2.5", md: "p-3", lg: "p-4" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function MaintenanceBanner(props: MaintenanceBannerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"message",
		"startsAt",
		"endsAt",
		"severity",
		"status",
		"onDismiss",
		"learnMoreHref",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<div
			role="alert"
			class={`solidui-maintenance-banner flex items-start gap-2.5 border ${sevCls[local.severity ?? "warning"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				class="mt-0.5 h-4 w-4 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path
					d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.1-2.1 2.7-2.5Z"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="min-w-0 flex-1">
				<div class={`flex items-center gap-2 font-medium ${textSize[local.size ?? "md"]}`}>
					<span class="rounded border border-current px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide">
						{local.status === "active" ? "In progress" : "Scheduled"}
					</span>
					<Show when={local.startsAt || local.endsAt}>
						<span class="tabular-nums opacity-80">{[local.startsAt, local.endsAt].filter(Boolean).join(" → ")}</span>
					</Show>
				</div>
				<p class={`mt-0.5 text-foreground/90 ${textSize[local.size ?? "md"]}`}>{local.message}</p>
				<Show when={local.learnMoreHref}>
					<a
						href={local.learnMoreHref}
						class={`mt-1 inline-block underline-offset-2 hover:underline ${local.size === "sm" ? "text-2xs" : "text-xs"}`}
					>
						View maintenance details
					</a>
				</Show>
			</div>
			<Show when={local.onDismiss}>
				<button
					type="button"
					aria-label="Dismiss"
					class="-mr-1.5 -mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => local.onDismiss?.()}
				>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
					</svg>
				</button>
			</Show>
		</div>
	);
}
