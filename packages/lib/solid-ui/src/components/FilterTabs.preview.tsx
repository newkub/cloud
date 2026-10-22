/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { FilterTabs } from "./FilterTabs";

export const preview = (): JSX.Element => {
	const [value, setValue] = createSignal("all");
	return (
		<FilterTabs
			tabs={[
				{ id: "all", label: "All", count: 24 },
				{ id: "open", label: "Open", count: 9 },
				{ id: "closed", label: "Closed", count: 15 },
			]}
			value={value()}
			onChange={setValue}
		/>
	);
};
