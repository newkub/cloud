/**
 * WorkflowEditor - SolidJS component for creating and editing workflows
 */

import { createMemo, createSignal, Show, splitProps } from "solid-js";
import type { Workflow, WorkflowStep, WorkflowTrigger } from "../../../types";
import { createSaveHandler, createStepHandlers, createTriggerHandlers } from "./workflow-editor/handlers";
import { StepEditor } from "./workflow-editor/StepEditor";
import { StepsSection } from "./workflow-editor/StepsSection";
import { TriggersSection } from "./workflow-editor/TriggersSection";
import type { WorkflowEditorProps } from "./workflow-editor/types";
import { WorkflowForm } from "./workflow-editor/WorkflowForm";

interface WorkflowEditorHeaderProps {
	workflow?: Workflow;
	onCancel?: () => void;
	onSave: () => void;
}

function WorkflowEditorHeader(props: WorkflowEditorHeaderProps) {
	return (
		<div class="workflow-header">
			<h2 class="workflow-title">{props.workflow ? "Edit Workflow" : "Create Workflow"}</h2>
			<div class="workflow-actions">
				<button class="action-button cancel" onClick={props.onCancel} type="button">
					Cancel
				</button>
				<button class="action-button save" onClick={props.onSave} type="button">
					Save
				</button>
			</div>
		</div>
	);
}

interface WorkflowEditorFormPanelProps {
	name: string;
	description: string;
	enabled: boolean;
	onNameChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onEnabledChange: (value: boolean) => void;
}

function WorkflowEditorFormPanel(props: WorkflowEditorFormPanelProps) {
	return (
		<WorkflowForm
			name={props.name}
			description={props.description}
			enabled={props.enabled}
			onNameChange={props.onNameChange}
			onDescriptionChange={props.onDescriptionChange}
			onEnabledChange={props.onEnabledChange}
		/>
	);
}

interface WorkflowEditorTriggersPanelProps {
	triggers: WorkflowTrigger[];
	onAddTrigger: () => void;
	onRemoveTrigger: (index: number) => void;
	onTriggerChange: (index: number, field: keyof WorkflowTrigger, value: unknown) => void;
}

function WorkflowEditorTriggersPanel(props: WorkflowEditorTriggersPanelProps) {
	return (
		<TriggersSection
			triggers={props.triggers}
			onAddTrigger={props.onAddTrigger}
			onRemoveTrigger={props.onRemoveTrigger}
			onTriggerChange={props.onTriggerChange}
		/>
	);
}

interface WorkflowEditorStepsPanelProps {
	steps: WorkflowStep[];
	selectedStepIndex: number | null;
	commands?: readonly { id: string; label: string }[];
	onAddStep: () => void;
	onRemoveStep: (index: number) => void;
	onSelectStep: (index: number | null) => void;
	onStepChange: (index: number, field: keyof WorkflowStep, value: unknown) => void;
	selectedStep: () => WorkflowStep | null;
}

function WorkflowEditorStepsPanel(props: WorkflowEditorStepsPanelProps) {
	return (
		<>
			<StepsSection
				steps={props.steps}
				selectedStepIndex={props.selectedStepIndex}
				commands={props.commands}
				onAddStep={props.onAddStep}
				onRemoveStep={props.onRemoveStep}
				onSelectStep={props.onSelectStep}
			/>

			<Show when={props.selectedStep()} keyed>
				{(step) => (
					<StepEditor
						step={step}
						index={props.selectedStepIndex ?? 0}
						commands={props.commands}
						onStepChange={props.onStepChange}
					/>
				)}
			</Show>
		</>
	);
}

function createWorkflowEditorState(props: {
	workflow?: Workflow;
	onSave?: (workflow: Workflow) => void;
	commands?: readonly { id: string; label: string }[];
}) {
	const [name, setName] = createSignal(props.workflow?.name ?? "");
	const [description, setDescription] = createSignal(props.workflow?.description ?? "");
	const [enabled, setEnabled] = createSignal(props.workflow?.enabled ?? true);
	const [steps, setSteps] = createSignal<WorkflowStep[]>([...(props.workflow?.steps ?? [])]);
	const [triggers, setTriggers] = createSignal([...(props.workflow?.triggers ?? [])]);
	const [selectedStepIndex, setSelectedStepIndex] = createSignal<number | null>(null);

	const { handleAddStep, handleRemoveStep, handleStepChange } = createStepHandlers(
		steps(),
		setSteps,
		selectedStepIndex(),
		setSelectedStepIndex,
	);

	const { handleAddTrigger, handleRemoveTrigger, handleTriggerChange } = createTriggerHandlers(triggers(), setTriggers);

	const handleSave = createSaveHandler(
		props.workflow,
		name(),
		description(),
		enabled(),
		steps(),
		triggers(),
		props.onSave,
	);

	const selectedStep = createMemo(() => {
		const index = selectedStepIndex();
		return index !== null ? steps()[index] : null;
	});

	return {
		name,
		setName,
		description,
		setDescription,
		enabled,
		setEnabled,
		steps,
		setSteps,
		triggers,
		setTriggers,
		selectedStepIndex,
		setSelectedStepIndex,
		handleAddStep,
		handleRemoveStep,
		handleStepChange,
		handleAddTrigger,
		handleRemoveTrigger,
		handleTriggerChange,
		handleSave,
		selectedStep,
	};
}

export function WorkflowEditor(props: WorkflowEditorProps) {
	const [local] = splitProps(props, ["workflow", "onSave", "onCancel", "commands"]);
	const state = createWorkflowEditorState(local);

	return (
		<div class="workflow-editor">
			<WorkflowEditorHeader workflow={local.workflow} onCancel={local.onCancel} onSave={state.handleSave} />

			<WorkflowEditorFormPanel
				name={state.name()}
				description={state.description()}
				enabled={state.enabled()}
				onNameChange={state.setName}
				onDescriptionChange={state.setDescription}
				onEnabledChange={state.setEnabled}
			/>

			<WorkflowEditorTriggersPanel
				triggers={state.triggers()}
				onAddTrigger={state.handleAddTrigger}
				onRemoveTrigger={state.handleRemoveTrigger}
				onTriggerChange={state.handleTriggerChange}
			/>

			<WorkflowEditorStepsPanel
				steps={state.steps()}
				selectedStepIndex={state.selectedStepIndex()}
				commands={local.commands}
				onAddStep={state.handleAddStep}
				onRemoveStep={state.handleRemoveStep}
				onSelectStep={state.setSelectedStepIndex}
				onStepChange={state.handleStepChange}
				selectedStep={state.selectedStep}
			/>
		</div>
	);
}

export type { WorkflowEditorProps };
