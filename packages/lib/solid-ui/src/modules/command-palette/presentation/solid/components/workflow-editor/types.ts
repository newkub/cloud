import type { Workflow, WorkflowStep } from "../../../../types";

export interface WorkflowEditorProps {
	workflow?: Workflow;
	onSave?: (workflow: Workflow) => void;
	onCancel?: () => void;
	commands?: readonly { id: string; label: string }[];
}

export interface StepEditorProps {
	step: WorkflowStep;
	index: number;
	commands?: readonly { id: string; label: string }[];
	onStepChange: (index: number, field: keyof WorkflowStep, value: unknown) => void;
}
