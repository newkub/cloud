/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { ActionRail } from "./ActionRail";

export const preview = (): JSX.Element => {
	const [value, setValue] = createSignal("Home");
	return (
		<ActionRail
			items={[
				{ icon: "⌂", label: "Home" },
				{ icon: "✉", label: "Messages", badge: true },
				{ icon: "⚙", label: "Settings" },
			]}
			value={value()}
			onChange={setValue}
		/>
	);
};
