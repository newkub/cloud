/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SearchFilters } from "./SearchFilters";

export const preview = (): JSX.Element => (
	<SearchFilters
		class="w-72 max-w-full"
		facets={[
			{
				label: "Category",
				options: [
					{ value: "Components", count: 42 },
					{ value: "Hooks", count: 18 },
					{ value: "Utilities", count: 9 },
				],
			},
			{
				label: "Status",
				options: [
					{ value: "Stable", count: 30 },
					{ value: "Beta", count: 12 },
				],
			},
		]}
	/>
);
