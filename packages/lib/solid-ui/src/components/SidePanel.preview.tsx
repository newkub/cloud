/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { SidePanel } from "./SidePanel";

export const preview = (): JSX.Element => {
	const [expanded, setExpanded] = createSignal(true);
	return (
		<div class="h-48">
			<SidePanel
				expanded={expanded()}
				onToggle={setExpanded}
				items={[
					{ icon: "⌂", label: "Dashboard", href: "#dashboard" },
					{ icon: "◫", label: "Projects", href: "#projects" },
					{ icon: "⚙", label: "Settings", href: "#settings" },
				]}
				value="Dashboard"
			/>
		</div>
	);
};
