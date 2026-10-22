/**
 * ColorSwatch - a single pressable color swatch with selected ring state.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface ColorSwatchProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** CSS color value shown in the swatch. */
	color: string;
	/** Selected state — draws the focus ring. @default false */
	selected?: boolean;
	/** Accessible label for the color. */
	label?: string;
	/** Swatch edge length in px. @default 24 */
	size?: number;
	/** Corner radius. */
	radius?: Radius;
}

export function ColorSwatch(props: ColorSwatchProps) {
	const [local, rest] = splitProps(props, ["class", "color", "selected", "label", "size", "radius"]);

	const className = () =>
		[
			"solidui-color-swatch inline-block border border-border transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			local.selected ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "",
			radiusMap[local.radius ?? "sm"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<button
			type="button"
			class={className()}
			style={{ "background-color": local.color, width: `${local.size ?? 24}px`, height: `${local.size ?? 24}px` }}
			aria-label={local.label ?? local.color}
			aria-pressed={local.selected ?? false}
			title={local.label ?? local.color}
			{...rest}
		/>
	);
}
