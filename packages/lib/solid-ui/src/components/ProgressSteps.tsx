/**
 * ProgressSteps — progress bar broken into per-step segments with status.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type ProgressStepStatus = "pending" | "active" | "done" | "failed";

export interface ProgressStep {
	label: string;
	status: ProgressStepStatus;
	/** Optional caption under the label. */
	description?: string;
}

export interface ProgressStepsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps: ProgressStep[];
	/** Show step labels below the bar. @default true */
	showLabels?: boolean;
	/** Show the legend row (done/total). @default false */
	showCount?: boolean;
	size?: "sm" | "md" | "lg";
	/** Segment corner radius. */
	radius?: Radius;
	onStepClick?: (step: ProgressStep, index: number) => void;
}

const segH = { sm: "h-1", md: "h-1.5", lg: "h-2" } as const;
const labelSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;
const segCls: Record<ProgressStepStatus, string> = {
	pending: "bg-muted",
	active: "bg-primary motion-safe:animate-pulse",
	done: "bg-success",
	failed: "bg-destructive",
};

export function ProgressSteps(props: ProgressStepsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"steps",
		"showLabels",
		"showCount",
		"size",
		"radius",
		"onStepClick",
	]);
	const steps = () => local.steps ?? [];
	const done = () => steps().filter((s) => s.status === "done").length;
	return (
		<div class={`solidui-progress-steps ${local.class ?? ""}`.trim()} {...rest}>
			<div class="flex gap-1">
				<For each={steps()}>
					{(s, i) => (
						// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: role/label applied only when clickable
						<div
							role={local.onStepClick ? "button" : undefined}
							tabIndex={local.onStepClick ? 0 : undefined}
							aria-label={`${s.label}: ${s.status}`}
							class={`flex-1 ${segH[local.size ?? "md"]} ${segCls[s.status]} ${radiusMap[local.radius ?? "full"]} ${
								local.onStepClick
									? "relative cursor-pointer hover:opacity-80 before:absolute before:inset-x-0 before:-inset-y-4 before:content-['']"
									: ""
							}`}
							title={s.label}
							onClick={() => local.onStepClick?.(s, i())}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									local.onStepClick?.(s, i());
								}
							}}
						/>
					)}
				</For>
			</div>
			<Show when={local.showLabels ?? true}>
				<div class="mt-1.5 flex justify-between">
					<For each={steps()}>
						{(s) => (
							<div
								class={`min-w-0 flex-1 text-center ${labelSize[local.size ?? "md"]} ${
									s.status === "active" ? "font-medium text-foreground" : "text-muted-foreground"
								}`}
							>
								<div class="truncate">{s.label}</div>
								<Show when={s.description}>
									<div class="truncate text-2xs text-muted-foreground/70">{s.description}</div>
								</Show>
							</div>
						)}
					</For>
				</div>
			</Show>
			<Show when={local.showCount}>
				<div class={`mt-1 text-center text-muted-foreground ${labelSize[local.size ?? "md"]}`}>
					{done()}/{steps().length} complete
				</div>
			</Show>
		</div>
	);
}
