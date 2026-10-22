/**
 * QrCode — SVG QR code rendered from a string value.
 */
import { For, type JSX, splitProps } from "solid-js";
import { encode } from "uqr";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface QrCodeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Value encoded in the QR code */
	value: string;
	/** Pixel size (square) @default 128 */
	size?: number;
	/** Quiet zone in modules @default 4 */
	margin?: number;
	/** Error correction level @default "M" */
	ecLevel?: "L" | "M" | "Q" | "H";
	/** Accessible label @default "QR code" */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function QrCode(props: QrCodeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"size",
		"margin",
		"ecLevel",
		"label",
		"radius",
		"elevation",
	]);
	const encoded = () => {
		try {
			return encode(local.value, { ecc: local.ecLevel ?? "M", border: local.margin ?? 4 });
		} catch {
			return { data: [], size: 0 };
		}
	};
	const cells = () => {
		const out: { x: number; y: number }[] = [];
		encoded().data.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell) out.push({ x, y });
			});
		});
		return out;
	};
	return (
		<div
			class={`solidui-qr-code inline-flex items-center justify-center border border-border bg-background p-3 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			role="img"
			aria-label={local.label ?? "QR code"}
			{...rest}
		>
			<svg
				width={local.size ?? 128}
				height={local.size ?? 128}
				viewBox={`0 0 ${encoded().size} ${encoded().size}`}
				shape-rendering="crispEdges"
				class="text-foreground"
				aria-hidden="true"
			>
				<For each={cells()}>{(c) => <rect x={c.x} y={c.y} width={1} height={1} fill="currentColor" />}</For>
			</svg>
		</div>
	);
}
