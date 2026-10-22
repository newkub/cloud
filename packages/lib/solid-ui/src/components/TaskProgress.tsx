/**
 * TaskProgress — list of tasks with a per-task progress bar and status icon.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type TaskStatus = "pending" | "running" | "done" | "error";

export interface TaskProgressItem {
	/** Task name. */
	label: string;
	/** Completion 0–100. @default 0 */
	progress?: number;
	/** Task state. @default "pending" */
	status?: TaskStatus;
}

export interface TaskProgressProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Tasks to display. */
	tasks: TaskProgressItem[];
	/** Show the per-task percent value. @default true */
	showPercent?: boolean;
	/** Corner radius of the bars. */
	radius?: Radius;
}

const barFill: Record<TaskStatus, string> = {
	pending: "bg-muted-foreground",
	running: "bg-primary",
	done: "bg-success",
	error: "bg-destructive",
};

const iconColor: Record<TaskStatus, string> = {
	pending: "text-muted-foreground",
	running: "text-primary",
	done: "text-success",
	error: "text-destructive",
};

const StatusIcon = (props: { status: TaskStatus }) => (
	<span class={`inline-flex h-3.5 w-3.5 shrink-0 ${iconColor[props.status]}`} aria-hidden="true">
		<Show
			when={props.status === "done"}
			fallback={
				<Show
					when={props.status === "error"}
					fallback={
						<Show
							when={props.status === "running"}
							fallback={
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="h-3.5 w-3.5"
									aria-hidden="true"
								>
									<circle cx="12" cy="12" r="9" />
								</svg>
							}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								class="h-3.5 w-3.5 motion-safe:animate-spin"
								aria-hidden="true"
							>
								<path d="M21 12a9 9 0 1 1-6.2-8.56" />
							</svg>
						</Show>
					}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-3.5 w-3.5"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="9" />
						<path d="m15 9-6 6" />
						<path d="m9 9 6 6" />
					</svg>
				</Show>
			}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-3.5 w-3.5"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="m8.5 12.5 2.5 2.5 4.5-5" />
			</svg>
		</Show>
	</span>
);

export function TaskProgress(props: TaskProgressProps) {
	const [local, rest] = splitProps(props, ["class", "tasks", "showPercent", "radius"]);
	const pct = (task: TaskProgressItem) => Math.min(100, Math.max(0, task.progress ?? 0));
	return (
		<ul class={`solidui-task-progress flex flex-col gap-3 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.tasks}>
				{(task) => (
					<li class="flex flex-col gap-1">
						<div class="flex items-center gap-2 text-xs">
							<StatusIcon status={task.status ?? "pending"} />
							<span class="min-w-0 flex-1 truncate font-medium text-foreground">{task.label}</span>
							<Show when={local.showPercent ?? true}>
								<span class="tabular-nums text-muted-foreground">{pct(task)}%</span>
							</Show>
						</div>
						<div
							role="progressbar"
							aria-label={task.label}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={pct(task)}
							class={`h-1.5 w-full overflow-hidden bg-muted ${radiusMap[local.radius ?? "full"]}`}
						>
							<div
								class={`h-full transition-[width] duration-500 motion-reduce:transition-none ${barFill[task.status ?? "pending"]}`}
								style={{ width: `${pct(task)}%` }}
							/>
						</div>
					</li>
				)}
			</For>
		</ul>
	);
}
