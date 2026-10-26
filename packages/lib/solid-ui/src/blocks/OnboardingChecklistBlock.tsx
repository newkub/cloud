/**
 * OnboardingChecklistBlock — activation checklist with progress, per-step actions and dismissal.
 */
import { createMemo, createSignal, For, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Checkbox } from "../components/Checkbox";
import { Progress } from "../components/Progress";

export interface OnboardingStep {
	/** Stable step id. */
	id: string;
	/** Step title. */
	label: string;
	/** Supporting text. */
	description?: string;
	/** Completed state supplied by the consumer. @default false */
	done?: boolean;
	/** Optional call-to-action rendered while the step is open. */
	action?: JSX.Element;
}

export interface OnboardingChecklistBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onToggle"> {
	/** Steps in display order. */
	steps: OnboardingStep[];
	/** Heading @default "Get started" */
	title?: string;
	/** Supporting text under the heading. */
	description?: string;
	/** Called when a step is toggled. */
	onToggle?: (id: string, done: boolean) => void;
	/** Called when the checklist is dismissed — hides it for this session. */
	onDismiss?: () => void;
	/** Show the dismiss action. @default true */
	dismissible?: boolean;
}

export function OnboardingChecklistBlock(props: OnboardingChecklistBlockProps) {
	const [local, setLocal] = createSignal<Record<string, boolean>>({});
	const [dismissed, setDismissed] = createSignal(false);

	const isDone = (step: OnboardingStep) => local()[step.id] ?? step.done ?? false;
	const completed = createMemo(() => props.steps.filter(isDone).length);
	const total = () => props.steps.length;
	const percent = () => (total() === 0 ? 0 : Math.round((completed() / total()) * 100));
	const allDone = () => total() > 0 && completed() === total();

	const toggle = (step: OnboardingStep, done: boolean) => {
		setLocal((previous) => ({ ...previous, [step.id]: done }));
		props.onToggle?.(step.id, done);
	};

	const dismiss = () => {
		setDismissed(true);
		props.onDismiss?.();
	};

	return (
		<Show when={!dismissed()}>
			<Card variant="outline" class={props.class}>
				<CardContent class="flex flex-col gap-4">
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h3 class="text-sm font-semibold text-foreground">{props.title ?? "Get started"}</h3>
							<Show when={props.description}>
								<p class="mt-1 text-xs text-muted-foreground">{props.description}</p>
							</Show>
						</div>
						<Show when={props.dismissible ?? true}>
							<Button type="button" variant="ghost" size="sm" onClick={dismiss}>
								Dismiss
							</Button>
						</Show>
					</div>

					<div class="flex flex-col gap-1.5">
						<div class="flex items-center justify-between text-xs text-muted-foreground">
							<span>
								{completed()} of {total()} steps complete
							</span>
							<span class="tabular-nums">{percent()}%</span>
						</div>
						<Progress value={completed()} max={total()} />
					</div>

					<div class="flex flex-col">
						<For each={props.steps}>
							{(step) => (
								<div class="flex items-start gap-3 border-b border-border/50 py-3 last:border-0">
									<Checkbox
										checked={isDone(step)}
										onChange={(checked) => toggle(step, checked)}
										aria-label={step.label}
										class="mt-0.5"
									/>
									<div class="min-w-0 flex-1">
										<p
											class={`text-sm ${
												isDone(step) ? "text-muted-foreground line-through" : "text-foreground"
											}`}
										>
											{step.label}
										</p>
										<Show when={step.description}>
											<p class="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
										</Show>
									</div>
									<Show when={!isDone(step) && step.action}>{step.action}</Show>
								</div>
							)}
						</For>
					</div>

					<Show when={allDone()}>
						<p class="text-xs text-success">You are all set — every step is complete.</p>
					</Show>
				</CardContent>
			</Card>
		</Show>
	);
}
