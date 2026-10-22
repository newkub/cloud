import type { PluginFilterControlProps } from "./types";

export function PluginFilterControl(props: PluginFilterControlProps) {
	return (
		<div class="plugin-controls">
			<label class="filter-toggle">
				<input
					type="checkbox"
					checked={props.showInstalledOnly()}
					onChange={(e) => props.setShowInstalledOnly(e.currentTarget.checked)}
					class="toggle-checkbox"
				/>
				Show Installed Only
			</label>
		</div>
	);
}
