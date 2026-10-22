/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VariantPicker } from "./VariantPicker";

export const preview = (): JSX.Element => (
	<VariantPicker
		class="w-72 max-w-full"
		groups={[
			{
				name: "Color",
				options: [
					{ value: "Slate", color: "slategray" },
					{ value: "Forest", color: "forestgreen" },
					{ value: "Sunset", color: "tomato", disabled: true },
				],
			},
			{
				name: "Size",
				options: [{ value: "S" }, { value: "M" }, { value: "L" }, { value: "XL", disabled: true }],
			},
		]}
		defaultValue={{ Color: "Forest", Size: "M" }}
	/>
);
