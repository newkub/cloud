/**
 * ColorSwatchPicker - grid of preset color swatches with single selection.
 */
import { For, type JSX, splitProps } from "solid-js";
import { ColorSwatch } from "./ColorSwatch";

export interface ColorSwatchPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Preset CSS color values. */
	colors: string[];
	/** Currently selected color. */
	value?: string;
	/** Called when a swatch is picked. */
	onSelect?: (color: string) => void;
	/** Swatch edge length in px. @default 24 */
	swatchSize?: number;
	/** Accessible group label. @default "Color swatches" */
	label?: string;
}

export function ColorSwatchPicker(props: ColorSwatchPickerProps) {
	const [local, rest] = splitProps(props, ["class", "colors", "value", "onSelect", "swatchSize", "label"]);

	const className = () =>
		["solidui-color-swatch-picker flex flex-wrap gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: swatch group, not a form fieldset
		<div class={className()} role="group" aria-label={local.label ?? "Color swatches"} {...rest}>
			<For each={local.colors}>
				{(color) => (
					<ColorSwatch
						color={color}
						size={local.swatchSize}
						selected={local.value === color}
						onClick={() => local.onSelect?.(color)}
					/>
				)}
			</For>
		</div>
	);
}
