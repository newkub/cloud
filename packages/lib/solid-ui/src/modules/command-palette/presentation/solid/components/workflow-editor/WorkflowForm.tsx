interface WorkflowFormProps {
	name: string;
	description: string;
	enabled: boolean;
	onNameChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onEnabledChange: (value: boolean) => void;
}

export function WorkflowForm(props: WorkflowFormProps) {
	return (
		<div class="workflow-form">
			<div class="form-group">
				<label for="workflow-name" class="form-label">
					Name
				</label>
				<input
					id="workflow-name"
					type="text"
					value={props.name}
					onInput={(e) => props.onNameChange(e.currentTarget.value)}
					class="form-input"
					placeholder="Workflow name"
				/>
			</div>

			<div class="form-group">
				<label for="workflow-description" class="form-label">
					Description
				</label>
				<textarea
					id="workflow-description"
					value={props.description}
					onInput={(e) => props.onDescriptionChange(e.currentTarget.value)}
					class="form-textarea"
					placeholder="Workflow description"
					rows={3}
				/>
			</div>

			<div class="form-group">
				<label class="form-label">
					<input
						type="checkbox"
						checked={props.enabled}
						onChange={(e) => props.onEnabledChange(e.currentTarget.checked)}
						class="form-checkbox"
					/>
					Enabled
				</label>
			</div>
		</div>
	);
}
