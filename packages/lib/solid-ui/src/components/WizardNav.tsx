/**
 * WizardNav — clickable step navigation with status indicators for wizards and multi-step flows.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export type WizardStepStatus = "done" | "active" | "pending" | "disabled";

export interface WizardNavStep {
	/** Step label. */
	label: string;
	/** Optional description under the label. */
	description?: string;
	/** Explicit status — derived from `current` when omitted. */
	status?: WizardStepStatus;
}

export interface WizardNavProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Step descriptors. */
	steps: WizardNavStep[];
	/** Current step index (0-based). @default 0 */
	current?: number;
	/** Called with the clicked step index and descriptor. */
	onStep?: (index: number, step: WizardNavStep) => void;
	/** Layout direction. @default "horizontal" */
	orientation?: "horizontal" | "vertical";
}

const circleCls: Record<WizardStepStatus, string> = {
	done: "border-primary bg-primary text-primary-foreground",
	active: "border-primary text-primary",
	pending: "border-border text-muted-foreground",
	disabled: "border-border text-muted-foreground opacity-50",
};

export function WizardNav(props: WizardNavProps) {
	const [local, rest] = splitProps(props, ["class", "steps", "current", "onStep", "orientation"]);
	const current = () => local.current ?? 0;
	const vertical = () => local.orientation === "vertical";
	const status = (step: WizardNavStep, i: number): WizardStepStatus =>
		step.status ?? (i < current() ? "done" : i === current() ? "active" : "pending");

	const check = (
		<svg
			class="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);

	return (
		<nav aria-label="Progress" class={`solidui-wizard-nav ${local.class ?? ""}`.trim()} {...rest}>
			<ol class={vertical() ? "flex flex-col" : "flex w-full items-start"}>
				<For each={local.steps}>
					{(step, i) => {
						const st = () => status(step, i());
						const last = () => i() === (local.steps?.length ?? 0) - 1;
						const connectorActive = () => i() < current();
						return (
							<li class={vertical() ? "flex flex-col" : "flex flex-1 items-center last:flex-none"}>
								<button
									type="button"
									class={`group flex items-center gap-3 rounded-md p-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none ${vertical() ? "" : "flex-col items-center text-center"}`}
									disabled={st() === "disabled"}
									aria-current={st() === "active" ? "step" : undefined}
									aria-disabled={st() === "disabled" ? true : undefined}
									onClick={() => local.onStep?.(i(), step)}
								>
									<span
										class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors ${circleCls[st()]}`}
									>
										<Show when={st() === "done"} fallback={i() + 1}>
											{check}
										</Show>
									</span>
									<span class="min-w-0">
										<span
											class={`block truncate text-sm font-medium ${
												st() === "active" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
											}`}
										>
											{step.label}
										</span>
										<Show when={step.description}>
											<span class="block truncate text-xs text-muted-foreground">{step.description}</span>
										</Show>
									</span>
								</button>
								<Show when={!last()}>
									<span
										aria-hidden="true"
										class={
											vertical()
												? `ml-4 h-6 w-px ${connectorActive() ? "bg-primary" : "bg-border"}`
												: `mx-3 h-px flex-1 ${connectorActive() ? "bg-primary" : "bg-border"}`
										}
									/>
								</Show>
							</li>
						);
					}}
				</For>
			</ol>
		</nav>
	);
}
