import { For } from "solid-js";
import type { WorkflowTrigger } from "../../../../types";

interface TriggersSectionProps {
	triggers: WorkflowTrigger[];
	onAddTrigger: () => void;
	onRemoveTrigger: (index: number) => void;
	onTriggerChange: (index: number, field: keyof WorkflowTrigger, value: unknown) => void;
}

export function TriggersSection(props: TriggersSectionProps) {
	return (
		<div class="workflow-section">
			<div class="section-header">
				<h3 class="section-title">Triggers</h3>
				<button class="add-button" onClick={props.onAddTrigger} type="button">
					Add Trigger
				</button>
			</div>
			<div class="triggers-list">
				<For each={props.triggers}>
					{(trigger, index) => (
						<div class="trigger-item">
							<select
								value={trigger.type}
								onChange={(e) => props.onTriggerChange(index(), "type", e.currentTarget.value)}
								class="form-select"
							>
								<option value="manual">Manual</option>
								<option value="command">Command</option>
								<option value="schedule">Schedule</option>
								<option value="event">Event</option>
							</select>
							<button class="remove-button" onClick={() => props.onRemoveTrigger(index())} type="button">
								Remove
							</button>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
