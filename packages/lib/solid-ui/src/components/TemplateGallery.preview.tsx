/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { TemplateGallery } from "./TemplateGallery";

export const preview = (): JSX.Element => {
	const [used, setUsed] = createSignal("");
	return (
		<div class="flex w-96 flex-col gap-2">
			<TemplateGallery
				onUse={(t) => setUsed(t.name)}
				templates={[
					{ id: "blank", name: "Blank", hue: 215 },
					{ id: "post", name: "Blog post", hue: 150, description: "Title + body" },
					{ id: "spec", name: "Spec sheet", hue: 30, description: "Sections + table" },
				]}
			/>
			<p class="m-0 text-xs text-muted-foreground">Used: {used() || "—"}</p>
		</div>
	);
};
