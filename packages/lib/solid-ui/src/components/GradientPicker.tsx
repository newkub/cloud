/**
 * GradientPicker - preset linear-gradient picker with live preview strip.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface GradientPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Preset gradients as CSS color-stop lists, e.g. ["#fff", "#000"]. */
	presets: string[][];
	/** Index of the selected preset. */
	value?: number;
	/** Called with the picked preset index. */
	onSelect?: (index: number) => void;
	/** Preview angle in degrees. @default 90 */
	angle?: number;
	/** Corner radius. */
	radius?: Radius;
}

export function GradientPicker(props: GradientPickerProps) {
	const [local, rest] = splitProps(props, ["class", "presets", "value", "onSelect", "angle", "radius"]);

	const className = () => ["solidui-gradient-picker flex flex-wrap gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: swatch group, not a form fieldset
		<div class={className()} role="group" aria-label="Gradient presets" {...rest}>
			<For each={local.presets}>
				{(stops, i) => (
					<button
						type="button"
						class={`h-8 w-14 border border-border transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "sm"]} ${local.value === i() ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
						style={{ background: `linear-gradient(${local.angle ?? 90}deg, ${stops.join(", ")})` }}
						aria-label={`Gradient ${i() + 1}`}
						aria-pressed={local.value === i()}
						onClick={() => local.onSelect?.(i())}
					/>
				)}
			</For>
		</div>
	);
}
