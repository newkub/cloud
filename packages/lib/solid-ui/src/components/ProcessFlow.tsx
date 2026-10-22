/**
 * ProcessFlow — numbered steps joined by arrow connectors, horizontal or vertical, with a current-step state.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface ProcessStep {
	/** Step title. */
	label: string;
	/** Secondary description line. */
	desc?: string;
	/** Icon rendered inside the step circle instead of the number. */
	icon?: JSX.Element;
}

export interface ProcessFlowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Ordered steps. */
	steps: ProcessStep[];
	/** Layout direction. @default "horizontal" */
	direction?: "horizontal" | "vertical";
	/** Index of the active step — earlier steps render as completed. */
	currentStep?: number;
	/** Called with the step index when a step is clicked or activated via keyboard. */
	onStepClick?: (index: number) => void;
}

export function ProcessFlow(props: ProcessFlowProps) {
	const [local, rest] = splitProps(props, ["class", "steps", "direction", "currentStep", "onStepClick", "aria-label"]);
	const steps = () => local.steps ?? [];
	const horizontal = () => (local.direction ?? "horizontal") === "horizontal";
	const interactive = () => local.onStepClick !== undefined;
	const current = () => local.currentStep ?? -1;

	const state = (i: number) => (i < current() ? "done" : i === current() ? "current" : "todo");
	const circleClass = (i: number) =>
		state(i) === "done"
			? "border-primary bg-primary text-primary-foreground"
			: state(i) === "current"
				? "border-primary bg-primary/10 text-primary"
				: "border-border bg-muted text-muted-foreground";

	const activate = (i: number) => local.onStepClick?.(i);
	const onKey = (e: KeyboardEvent, i: number) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			activate(i);
		}
	};

	const Arrow = () => (
		<svg
			viewBox="0 0 16 16"
			class={`size-4 shrink-0 ${horizontal() ? "mx-1 self-center" : "my-1 rotate-90 self-center"}`}
			aria-hidden="true"
		>
			<path d="M 2 8 H 13 M 9 4 L 13 8 L 9 12" fill="none" stroke-width="1.5" class="stroke-muted-foreground" />
		</svg>
	);

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic step group, not a form fieldset
		<div
			class={`solidui-process-flow flex ${horizontal() ? "flex-row flex-wrap items-start" : "flex-col"} ${local.class ?? ""}`.trim()}
			role="group"
			aria-label={
				local["aria-label"] ??
				`Process flow: ${steps()
					.map((s) => s.label)
					.join(" → ")}`
			}
			{...rest}
		>
			<For each={steps()}>
				{(s, i) => (
					<>
						<Show when={i() > 0}>
							<Arrow />
						</Show>
						<div
							class={`flex ${horizontal() ? "w-28 flex-col items-center gap-2 text-center" : "flex-row items-center gap-3"}`}
						>
							{/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: role/pressed applied only when clickable */}
							<div
								role={interactive() ? "button" : undefined}
								tabindex={interactive() ? 0 : undefined}
								aria-pressed={interactive() ? i() === current() : undefined}
								aria-current={i() === current() ? "step" : undefined}
								class={`flex size-9 shrink-0 items-center justify-center rounded-full border font-medium text-sm tabular-nums motion-reduce:transition-none transition-colors ${circleClass(i())} ${
									interactive()
										? "cursor-pointer outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring"
										: ""
								}`}
								onClick={() => interactive() && activate(i())}
								onKeyDown={(e) => interactive() && onKey(e, i())}
							>
								{s.icon ?? i() + 1}
							</div>
							<div class={horizontal() ? "" : "min-w-0"}>
								<div class="font-medium text-foreground text-sm">{s.label}</div>
								<Show when={s.desc}>
									<div class="text-muted-foreground text-xs">{s.desc}</div>
								</Show>
							</div>
						</div>
					</>
				)}
			</For>
		</div>
	);
}
