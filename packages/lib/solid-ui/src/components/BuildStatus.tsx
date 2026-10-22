/**
 * BuildStatus — CI build card: status, commit, branch, duration, link.
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

export type BuildState = "success" | "failed" | "running" | "queued" | "canceled";

export interface BuildStatusProps extends JSX.HTMLAttributes<HTMLDivElement> {
	status: BuildState;
	/** Short commit sha. */
	commit?: string;
	/** Commit message. */
	message?: string;
	branch?: string;
	/** Build number, e.g. "#142". */
	number?: string | number;
	/** Duration text or ms. */
	duration?: string;
	/** Triggered-by. */
	triggeredBy?: string;
	url?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const stateMap: Record<BuildState, { cls: string; dot: string; label: string; path: string }> = {
	success: { cls: "text-success", dot: "bg-success", label: "Passed", path: "m5 13 4 4L19 7" },
	failed: { cls: "text-destructive", dot: "bg-destructive", label: "Failed", path: "M18 6 6 18M6 6l12 12" },
	running: { cls: "text-info", dot: "bg-info", label: "Running", path: "M21 12a9 9 0 1 1-9-9" },
	queued: { cls: "text-warning", dot: "bg-warning", label: "Queued", path: "M12 8v4m0 4h.01" },
	canceled: {
		cls: "text-muted-foreground",
		dot: "bg-muted-foreground",
		label: "Canceled",
		path: "M12 12m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0",
	},
};

const pad = { sm: "p-2.5", md: "p-3.5", lg: "p-4" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function BuildStatus(props: BuildStatusProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"status",
		"commit",
		"message",
		"branch",
		"number",
		"duration",
		"triggeredBy",
		"url",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const st = () => stateMap[local.status ?? "queued"];
	return (
		<div
			class={`solidui-build-status flex items-center gap-3 ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				class={`h-4 w-4 shrink-0 ${st().cls} ${local.status === "running" ? "motion-safe:animate-spin" : ""}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d={st().path} stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<span class={`font-medium ${st().cls} ${local.size === "lg" ? "text-base" : "text-sm"}`}>
						Build {st().label}
					</span>
					<Show when={local.number}>
						<span class="font-mono text-2xs text-muted-foreground">#{local.number}</span>
					</Show>
				</div>
				<div class={`mt-0.5 flex flex-wrap items-center gap-2 text-muted-foreground ${textSize[local.size ?? "md"]}`}>
					<Show when={local.branch}>
						<code class="rounded bg-muted px-1 font-mono">{local.branch}</code>
					</Show>
					<Show when={local.commit}>
						<code class="font-mono">{local.commit}</code>
					</Show>
					<Show when={local.message}>
						<span class="truncate">{local.message}</span>
					</Show>
				</div>
			</div>
			<div class={`shrink-0 text-right text-muted-foreground ${textSize[local.size ?? "md"]}`}>
				<Show when={local.duration}>
					<div class="tabular-nums">{local.duration}</div>
				</Show>
				<Show when={local.triggeredBy}>
					<div class="text-2xs">by {local.triggeredBy}</div>
				</Show>
				<Show when={local.url}>
					<a
						href={local.url}
						class="text-2xs text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						View →
					</a>
				</Show>
			</div>
		</div>
	);
}
