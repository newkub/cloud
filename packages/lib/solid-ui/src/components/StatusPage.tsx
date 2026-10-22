/**
 * StatusPage — services uptime grid with status dots and daily uptime bars.
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

export type ServiceState = "operational" | "degraded" | "outage" | "maintenance";

export interface ServiceStatus {
	name: string;
	state: ServiceState;
	/** Daily uptime percentages (oldest → newest) — renders as a bar strip. */
	uptime?: number[];
	/** Optional note, e.g. "Investigating latency". */
	note?: string;
}

export interface StatusPageProps extends JSX.HTMLAttributes<HTMLDivElement> {
	services: ServiceStatus[];
	/** Overall banner text — auto-derived when omitted. */
	summary?: string;
	/** Last-updated text. */
	updatedAt?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const stateMap: Record<ServiceState, { dot: string; label: string; cls: string }> = {
	operational: { dot: "bg-success", label: "Operational", cls: "text-success" },
	degraded: { dot: "bg-warning", label: "Degraded", cls: "text-warning" },
	outage: { dot: "bg-destructive", label: "Outage", cls: "text-destructive" },
	maintenance: { dot: "bg-info", label: "Maintenance", cls: "text-info" },
};

const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;

export function StatusPage(props: StatusPageProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"services",
		"summary",
		"updatedAt",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const allOk = () => (local.services ?? []).every((s) => s.state === "operational");
	const barColor = (pct: number) =>
		pct >= 99.9 ? "bg-success" : pct >= 99 ? "bg-success/70" : pct >= 95 ? "bg-warning" : "bg-destructive";

	return (
		<div
			class={`solidui-status-page ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`border-b border-border ${pad[local.size ?? "md"]}`}>
				<div class="flex items-center gap-2">
					<span class={`h-2.5 w-2.5 rounded-full ${allOk() ? "bg-success" : "bg-warning"}`} />
					<span class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
						{local.summary ?? (allOk() ? "All systems operational" : "Some systems affected")}
					</span>
					<Show when={local.updatedAt}>
						<span class="ml-auto text-2xs text-muted-foreground">Updated {local.updatedAt}</span>
					</Show>
				</div>
			</div>
			<ul class={`divide-y divide-border/50 ${pad[local.size ?? "md"]} py-0`}>
				<For each={local.services ?? []}>
					{(s) => {
						const st = () => stateMap[s.state];
						return (
							<li class="flex items-center gap-3 py-2.5">
								<span class={`h-2 w-2 shrink-0 rounded-full ${st().dot}`} />
								<span class={`flex-1 text-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>{s.name}</span>
								<Show when={s.uptime?.length}>
									<span class="hidden items-end gap-px sm:flex" aria-hidden="true">
										<For each={s.uptime}>
											{(u) => <span class={`h-3.5 w-1 rounded-sm ${barColor(u)}`} title={`${u.toFixed(2)}%`} />}
										</For>
									</span>
								</Show>
								<span class={`text-2xs font-medium ${st().cls}`}>{s.note ?? st().label}</span>
							</li>
						);
					}}
				</For>
			</ul>
		</div>
	);
}
