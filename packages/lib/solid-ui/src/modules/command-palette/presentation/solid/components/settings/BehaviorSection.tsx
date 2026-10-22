import type { BehaviorSectionProps } from "./types";

export function BehaviorSection(props: BehaviorSectionProps) {
	return (
		<div class="settings-section">
			<h3 class="section-title">Behavior</h3>
			<div class="setting-item">
				<label class="setting-label">
					<input
						type="checkbox"
						checked={props.settings.enableHistory}
						onChange={(e) => props.onToggleHistory(e.currentTarget.checked)}
						class="setting-checkbox"
					/>
					Enable History
				</label>
			</div>
			<div class="setting-item">
				<label class="setting-label">
					<input
						type="checkbox"
						checked={props.settings.enableAnimations}
						onChange={(e) => props.onToggleAnimations(e.currentTarget.checked)}
						class="setting-checkbox"
					/>
					Enable Animations
				</label>
			</div>
			<div class="setting-item">
				<label class="setting-label">
					<input
						type="checkbox"
						checked={props.settings.autoClose}
						onChange={(e) => props.onToggleAutoClose(e.currentTarget.checked)}
						class="setting-checkbox"
					/>
					Auto Close After Selection
				</label>
			</div>
			<div class="setting-item">
				<label for="debounce-delay" class="setting-label">
					Debounce Delay (ms)
				</label>
				<input
					id="debounce-delay"
					type="number"
					value={props.settings.debounceDelay}
					onChange={(e) => props.onDebounceChange(parseInt(e.currentTarget.value, 10))}
					class="setting-input"
					min="0"
					max="500"
				/>
			</div>
		</div>
	);
}
