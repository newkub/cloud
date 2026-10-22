/**
 * AgentStepTimeline - vertical feed of agent execution steps with status icons and a connecting line.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type AgentStepStatus = "pending" | "running" | "done" | "error";

export interface AgentStep {
	/** Step title. */
	title: string;
	/** Step status. */
	status: AgentStepStatus;
	/** Optional detail body shown under the title. */
	detail?: string;
	/** Duration label ("1.2s") or milliseconds. */
	duration?: string | number;
}

const SAMPLE_STEPS: AgentStep[] = [
	{ title: "Plan task", status: "done", detail: "Decomposed the request into three subtasks.", duration: "0.8s" },
	{ title: "Search codebase", status: "done", duration: "2.1s" },
	{ title: "Apply edits", status: "running", detail: "Editing src/components/AgentStepTimeline.tsx" },
	{ title: "Run tests", status: "pending" },
];

const statusTone: Record<AgentStepStatus, string> = {
	pending: "text-muted-foreground",
	running: "text-primary",
	done: "text-success",
	error: "text-destructive",
};

const statusLabel: Record<AgentStepStatus, string> = {
	pending: "Pending",
	running: "Running",
	done: "Done",
	error: "Failed",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "p-3 text-xs",
	md: "p-4 text-sm",
	lg: "p-6 text-base",
};

function formatDuration(d: string | number): string {
	if (typeof d === "string") return d;
	return d >= 1000 ? `${(d / 1000).toFixed(1)}s` : `${Math.round(d)}ms`;
}

function StepIcon(props: { status: AgentStepStatus }) {
	return (
		<>
			<Show when={props.status === "running"}>
				<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
			</Show>
			<Show when={props.status === "done"}>
				<NamedIcon name="check" class="h-4 w-4" />
			</Show>
			<Show when={props.status === "error"}>
				<NamedIcon name="x" class="h-4 w-4" />
			</Show>
			<Show when={props.status === "pending"}>
				<NamedIcon name="clock" class="h-4 w-4" />
			</Show>
		</>
	);
}

export interface AgentStepTimelineProps extends JSX.HTMLAttributes<HTMLOListElement> {
	/** Steps to render; falls back to sample data. */
	steps?: AgentStep[];
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function AgentStepTimeline(props: AgentStepTimelineProps) {
	const [local, rest] = splitProps(props, ["steps", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-agent-step-timeline m-0 list-none border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const steps = () => local.steps ?? SAMPLE_STEPS;

	return (
		<ol class={className()} aria-label="Agent steps" {...dom}>
			<For each={steps()}>
				{(step, i) => (
					<li class="relative flex gap-3 pb-5 last:pb-0">
						<div class="flex flex-col items-center">
							<span
								class={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-surface ${statusTone[step.status]}`}
								aria-hidden="true"
							>
								<StepIcon status={step.status} />
							</span>
							<Show when={i() < steps().length - 1}>
								<span class="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
							</Show>
						</div>
						<div class="min-w-0 flex-1 pt-0.5">
							<div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
								<span class="font-medium text-foreground">{step.title}</span>
								<span class={`text-2xs font-semibold uppercase tracking-wide ${statusTone[step.status]}`}>
									{statusLabel[step.status]}
								</span>
								<Show when={step.duration !== undefined}>
									<span class="text-2xs tabular-nums text-muted-foreground">
										{formatDuration(step.duration as string | number)}
									</span>
								</Show>
							</div>
							<Show when={step.detail}>
								<p class="mt-1 text-muted-foreground">{step.detail}</p>
							</Show>
						</div>
					</li>
				)}
			</For>
			<Show when={steps().length === 0}>
				<li class="py-4 text-center text-muted-foreground">No steps yet.</li>
			</Show>
		</ol>
	);
}
