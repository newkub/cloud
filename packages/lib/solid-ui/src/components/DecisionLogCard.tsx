/**
 * DecisionLogCard - decision statement card with context/outcome sections and a status chip.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	type ChipVariant,
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type DecisionStatus = "proposed" | "decided" | "revisited" | "superseded";

export interface DecisionLogCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Decision statement. */
	title: string;
	/** When the decision was made — ISO string or Date. */
	decidedAt: string | Date;
	/** Who made the decision. */
	decidedBy?: string;
	/** Background/rationale text. */
	context?: string;
	/** Observed outcome text. */
	outcome?: string;
	/** Lifecycle state. @default "decided" */
	status?: DecisionStatus;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const statusChip: Record<DecisionStatus, ChipVariant> = {
	proposed: "warning",
	decided: "success",
	revisited: "primary",
	superseded: "default",
};

const statusLabel: Record<DecisionStatus, string> = {
	proposed: "Proposed",
	decided: "Decided",
	revisited: "Revisited",
	superseded: "Superseded",
};

export function DecisionLogCard(props: DecisionLogCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-decision-log-card flex flex-col gap-3 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["title", "decidedAt", "decidedBy", "context", "outcome", "status"]);

	const stamp = () =>
		!local.decidedAt ? "" : typeof local.decidedAt === "string" ? local.decidedAt : local.decidedAt.toISOString();
	const dateTime = () => stamp();
	const dateText = () => stamp().slice(0, 10);

	return (
		<div class={className()} {...rest}>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1">
					<div class="font-semibold text-foreground">{local.title}</div>
					<div class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
						<time dateTime={dateTime()}>{dateText()}</time>
						<Show when={local.decidedBy}>
							<span aria-hidden="true">·</span>
							<span>by {local.decidedBy}</span>
						</Show>
					</div>
				</div>
				<span
					class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-semibold ${chipVariants[statusChip[local.status ?? "decided"]]}`}
				>
					{statusLabel[local.status ?? "decided"]}
				</span>
			</div>
			<Show when={local.context}>
				<section aria-label="Context" class="text-sm">
					<div class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Context</div>
					<p class="mt-1 text-foreground">{local.context}</p>
				</section>
			</Show>
			<Show when={local.outcome}>
				<section aria-label="Outcome" class="text-sm">
					<div class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Outcome</div>
					<p class="mt-1 text-foreground">{local.outcome}</p>
				</section>
			</Show>
		</div>
	);
}
