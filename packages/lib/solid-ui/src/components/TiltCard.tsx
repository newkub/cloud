/**
 * TiltCard - card that tilts in 3D toward the pointer on hover.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TiltCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Max tilt angle in degrees. @default 10 */
	max?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TiltCard(props: TiltCardProps) {
	const [local, rest] = splitProps(props, ["class", "max", "radius", "elevation", "children"]);
	const [transform, setTransform] = createSignal("");

	const onMove = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width - 0.5;
		const py = (e.clientY - rect.top) / rect.height - 0.5;
		const m = local.max ?? 10;
		setTransform(`perspective(600px) rotateX(${(-py * m).toFixed(2)}deg) rotateY(${(px * m).toFixed(2)}deg)`);
	};

	const onLeave = () => setTransform("");

	const className = () =>
		[
			"solidui-tilt-card border border-border bg-card p-4 transition-transform duration-150 motion-reduce:transition-none will-change-transform",
			radiusMap[local.radius ?? "lg"],
			elevationMap[local.elevation ?? "sm"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: tilt is a presentational pointer effect
		<div class={className()} style={{ transform: transform() }} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
			{local.children}
		</div>
	);
}
