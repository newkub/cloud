import { For } from "solid-js";
import type { WorkflowCondition, WorkflowErrorHandling } from "../../../../types";
import type { StepEditorProps } from "./types";

interface StepCommandSelectProps {
	stepId?: string;
	index: number;
	commands?: readonly { id: string; label: string }[];
	onStepChange: (index: number, field: "commandId", value: string) => void;
}

function StepCommandSelect(props: StepCommandSelectProps) {
	return (
		<div class="form-group">
			<label for="step-command" class="form-label">
				Command
			</label>
			<select
				id="step-command"
				value={props.stepId ?? ""}
				onChange={(e) => props.onStepChange(props.index, "commandId", e.currentTarget.value)}
				class="form-select"
			>
				<option value="">Select a command</option>
				<For each={props.commands ?? []}>{(command) => <option value={command.id}>{command.label}</option>}</For>
			</select>
		</div>
	);
}

interface StepDelayInputProps {
	delay?: number;
	index: number;
	onStepChange: (index: number, field: "delay", value: number) => void;
}

function StepDelayInput(props: StepDelayInputProps) {
	return (
		<div class="form-group">
			<label for="step-delay" class="form-label">
				Delay (ms)
			</label>
			<input
				id="step-delay"
				type="number"
				value={props.delay ?? 0}
				onChange={(e) => props.onStepChange(props.index, "delay", Number.parseInt(e.currentTarget.value, 10))}
				class="form-input"
				min="0"
			/>
		</div>
	);
}

interface StepConditionSelectProps {
	conditionType?: WorkflowCondition["type"];
	index: number;
	onStepChange: (index: number, field: "condition", value: WorkflowCondition) => void;
}

function StepConditionSelect(props: StepConditionSelectProps) {
	return (
		<div class="form-group">
			<label for="step-condition" class="form-label">
				Condition
			</label>
			<select
				id="step-condition"
				value={props.conditionType ?? "success"}
				onChange={(e) => {
					const condition: WorkflowCondition = {
						type: e.currentTarget.value as WorkflowCondition["type"],
					};
					props.onStepChange(props.index, "condition", condition);
				}}
				class="form-select"
			>
				<option value="success">On Success</option>
				<option value="failure">On Failure</option>
				<option value="always">Always</option>
				<option value="custom">Custom</option>
			</select>
		</div>
	);
}

interface StepErrorHandlingSelectProps {
	errorHandlingType?: WorkflowErrorHandling["type"];
	index: number;
	onStepChange: (index: number, field: "onError", value: WorkflowErrorHandling) => void;
}

function StepErrorHandlingSelect(props: StepErrorHandlingSelectProps) {
	return (
		<div class="form-group">
			<label for="step-error-handling" class="form-label">
				Error Handling
			</label>
			<select
				id="step-error-handling"
				value={props.errorHandlingType ?? "stop"}
				onChange={(e) => {
					const errorHandling: WorkflowErrorHandling = {
						type: e.currentTarget.value as WorkflowErrorHandling["type"],
					};
					props.onStepChange(props.index, "onError", errorHandling);
				}}
				class="form-select"
			>
				<option value="stop">Stop</option>
				<option value="continue">Continue</option>
				<option value="retry">Retry</option>
			</select>
		</div>
	);
}

export function StepEditor(props: StepEditorProps) {
	return (
		<div class="step-editor">
			<h3 class="section-title">Edit Step {props.index + 1}</h3>
			<StepCommandSelect
				stepId={props.step.commandId}
				index={props.index}
				commands={props.commands}
				onStepChange={props.onStepChange}
			/>
			<StepDelayInput delay={props.step.delay} index={props.index} onStepChange={props.onStepChange} />
			<StepConditionSelect
				conditionType={props.step.condition?.type}
				index={props.index}
				onStepChange={props.onStepChange}
			/>
			<StepErrorHandlingSelect
				errorHandlingType={props.step.onError?.type}
				index={props.index}
				onStepChange={props.onStepChange}
			/>
		</div>
	);
}
