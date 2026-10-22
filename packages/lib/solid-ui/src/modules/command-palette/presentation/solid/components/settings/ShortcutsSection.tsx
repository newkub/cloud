import { For, Show } from "solid-js";
import type { ShortcutsSectionProps } from "./types";

export function ShortcutsSection(props: ShortcutsSectionProps) {
	return (
		<div class="settings-section">
			<h3 class="section-title">Keyboard Shortcuts</h3>
			<div class="shortcuts-list">
				<For each={Object.entries(props.shortcuts)}>
					{([action, shortcut]) => (
						<div class="shortcut-item">
							<span class="shortcut-action">{action}</span>
							<Show when={props.editingShortcut() === action}>
								<button
									class="shortcut-edit-button editing"
									onKeyDown={(e) => props.onKeyDown(action, e)}
									type="button"
								>
									Press a key...
								</button>
							</Show>
							<Show when={props.editingShortcut() !== action}>
								<span class="shortcut-value">{shortcut}</span>
								<button class="shortcut-edit-button" onClick={() => props.onEdit(action)} type="button">
									Edit
								</button>
							</Show>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
