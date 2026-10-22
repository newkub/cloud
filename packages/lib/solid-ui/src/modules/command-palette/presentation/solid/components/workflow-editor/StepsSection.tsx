import { For } from "solid-js";
import type { WorkflowStep } from "../../../../types";

interface StepsSectionProps {
	steps: WorkflowStep[];
	selectedStepIndex: number | null;
	commands?: readonly { id: string; label: string }[];
	onAddStep: () => void;
	onRemoveStep: (index: number) => void;
	onSelectStep: (index: number) => void;
}

export function StepsSection(props: StepsSectionProps) {
	return (
		<div class="workflow-section">
			<div class="section-header">
				<h3 class="section-title">Steps</h3>
				<button class="add-button" onClick={props.onAddStep} type="button">
					Add Step
				</button>
			</div>
			<div class="steps-list">
				<For each={props.steps}>
					{(step, index) => (
						<button
							class={`step-item ${props.selectedStepIndex === index() ? "selected" : ""}`}
							onClick={() => props.onSelectStep(index())}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									props.onSelectStep(index());
								}
							}}
							type="button"
						>
							<div class="step-header">
								<span class="step-number">Step {index() + 1}</span>
								<button
									class="remove-button"
									onClick={(e) => {
										e.stopPropagation();
										props.onRemoveStep(index());
									}}
									type="button"
								>
									Remove
								</button>
							</div>
							<div class="step-summary">
								{step.commandId
									? (props.commands?.find((c) => c.id === step.commandId)?.label ?? step.commandId)
									: "No command selected"}
							</div>
						</button>
					)}
				</For>
			</div>
		</div>
	);
}
