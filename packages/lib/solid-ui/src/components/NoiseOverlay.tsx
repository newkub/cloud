/**
 * NoiseOverlay — fractal noise texture layer rendered via an inline SVG feTurbulence background.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";

export interface NoiseOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Layer opacity 0–1. @default 0.06 */
	opacity?: number;
	/** Noise frequency — higher is finer grain. @default 0.8 */
	frequency?: number;
	/** Position the layer absolutely over the parent (`relative`) or fix it to the viewport. @default "absolute" */
	fixed?: boolean;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const noiseUri = (frequency: number) => {
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export function NoiseOverlay(props: NoiseOverlayProps) {
	const [local, pass] = splitProps(props, ["opacity", "frequency"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "pointer-events-none inset-0",
		unstyled: props.unstyled,
		axes: [{ prop: "fixed", map: { true: "fixed", false: "absolute" }, default: "false" }],
	});
	return (
		<div
			class={className()}
			aria-hidden="true"
			style={{
				"background-image": noiseUri(local.frequency ?? 0.8),
				opacity: `${local.opacity ?? 0.06}`,
			}}
			{...rest}
		/>
	);
}
