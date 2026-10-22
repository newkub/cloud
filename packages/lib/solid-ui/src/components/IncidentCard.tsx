/**
 * IncidentCard - incident summary card: severity badge, status pill, commander and start time.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

export interface IncidentCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Incident id, e.g. "INC-1042". */
	id: string;
	/** Incident title. */
	title: string;
	/** Incident severity. */
	severity: IncidentSeverity;
	/** Lifecycle status. */
	status: IncidentStatus;
	/** Incident commander name. */
	commander?: string;
	/** Start time text, e.g. "Mar 4, 09:12". */
	startedAt?: string;
	/** Link to the incident page — wraps the title in an anchor. */
	href?: string;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const severityChip: Record<IncidentSeverity, string> = {
	critical: chipVariants.destructive,
	high: chipVariants.warning,
	medium: chipVariants.primary,
	low: chipVariants.default,
};

const statusChip: Record<IncidentStatus, string> = {
	investigating: chipVariants.destructive,
	identified: chipVariants.warning,
	monitoring: chipVariants.primary,
	resolved: chipVariants.success,
};

const statusDot: Record<IncidentStatus, string> = {
	investigating: "bg-destructive",
	identified: "bg-warning",
	monitoring: "bg-primary",
	resolved: "bg-success",
};

const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;

export function IncidentCard(props: IncidentCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"id",
		"title",
		"severity",
		"status",
		"commander",
		"startedAt",
		"href",
		"variant",
		"size",
		"radius",
		"elevation",
		"unstyled",
	]);

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-incident-card border",
					surfaceVariants[local.variant ?? "default"],
					pad[local.size ?? "md"],
					radiusMap[local.radius ?? "lg"],
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	const meta = () =>
		[local.commander ? `Commander ${local.commander}` : null, local.startedAt ? `Started ${local.startedAt}` : null]
			.filter(Boolean)
			.join(" · ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1">
					<div class="font-mono text-2xs text-muted-foreground">{local.id}</div>
					<div class="mt-0.5">
						<Show when={local.href} fallback={<span class="text-sm font-medium text-foreground">{local.title}</span>}>
							<a
								href={local.href}
								class="text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								{local.title}
							</a>
						</Show>
					</div>
				</div>
				<span
					class={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium capitalize ${statusChip[local.status]}`}
				>
					<span class={`h-1.5 w-1.5 rounded-full ${statusDot[local.status]}`} aria-hidden="true" />
					{local.status}
				</span>
			</div>
			<div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
				<span
					class={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold capitalize ${severityChip[local.severity]}`}
				>
					{local.severity}
				</span>
				<Show when={meta()}>
					<span class="truncate text-muted-foreground">{meta()}</span>
				</Show>
			</div>
		</div>
	);
}
