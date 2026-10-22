import type { Workflow, WorkflowStep, WorkflowTrigger } from "../../../../types";

export function createStepHandlers(
	steps: WorkflowStep[],
	setSteps: (steps: WorkflowStep[]) => void,
	selectedStepIndex: number | null,
	setSelectedStepIndex: (index: number | null) => void,
) {
	const handleAddStep = () => {
		const newStep: WorkflowStep = {
			id: `step-${Date.now()}`,
			commandId: "",
			order: steps.length,
		};
		setSteps([...steps, newStep]);
		setSelectedStepIndex(steps.length);
	};

	const handleRemoveStep = (index: number) => {
		const newSteps = steps.filter((_, i) => i !== index);
		setSteps(newSteps.map((step, i) => ({ ...step, order: i })));
		if (selectedStepIndex === index) {
			setSelectedStepIndex(null);
		}
	};

	const handleStepChange = (index: number, field: keyof WorkflowStep, value: unknown) => {
		const newSteps = [...steps];
		const currentStep = newSteps[index];
		newSteps[index] = {
			...currentStep,
			[field]: value,
		} as WorkflowStep;
		setSteps(newSteps);
	};

	return { handleAddStep, handleRemoveStep, handleStepChange };
}

export function createTriggerHandlers(triggers: WorkflowTrigger[], setTriggers: (triggers: WorkflowTrigger[]) => void) {
	const handleAddTrigger = () => {
		const newTrigger: WorkflowTrigger = {
			type: "manual",
			config: {},
		};
		setTriggers([...triggers, newTrigger]);
	};

	const handleRemoveTrigger = (index: number) => {
		setTriggers(triggers.filter((_, i) => i !== index));
	};

	const handleTriggerChange = (index: number, field: keyof WorkflowTrigger, value: unknown) => {
		const newTriggers = [...triggers];
		const currentTrigger = newTriggers[index];
		newTriggers[index] = {
			...currentTrigger,
			[field]: value,
		} as WorkflowTrigger;
		setTriggers(newTriggers);
	};

	return { handleAddTrigger, handleRemoveTrigger, handleTriggerChange };
}

export function createSaveHandler(
	workflow: Workflow | undefined,
	name: string,
	description: string,
	enabled: boolean,
	steps: WorkflowStep[],
	triggers: WorkflowTrigger[],
	onSave?: (workflow: Workflow) => void,
) {
	return () => {
		const newWorkflow: Workflow = {
			id: workflow?.id ?? `workflow-${Date.now()}`,
			name,
			description,
			steps,
			enabled,
			triggers,
			createdAt: workflow?.createdAt ?? new Date(),
			updatedAt: new Date(),
		};
		onSave?.(newWorkflow);
	};
}
