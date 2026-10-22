/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ContextBar } from "./ContextBar";

export const preview = (): JSX.Element => (
	<ContextBar
		crumbs={[
			{ label: "Docs", href: "/docs" },
			{ label: "Components", href: "/docs/components" },
			{ label: "ContextBar" },
		]}
		actions={
			<button type="button" class="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
				Edit page
			</button>
		}
	/>
);
