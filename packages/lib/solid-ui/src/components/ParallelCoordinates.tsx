/**
 * ParallelCoordinates — one polyline per record across shared vertical axes.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ParallelCoordinatesProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Axis labels — order matches each record's value positions. */
	axes?: string[];
	/** Records — each is an array of values, one per axis. */
	data?: number[][];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ParallelCoordinates(props: ParallelCoordinatesProps) {
	const merged = mergeProps({ width: 420, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"axes",
		"data",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const data = local.data ?? [];
		const nAxes = Math.max(1, local.axes?.length ?? 0, ...data.map((d) => d.length));
		const pad = 24;
		const x = (a: number) => pad + (a / Math.max(1, nAxes - 1)) * (local.width - pad * 2);
		const yOf = (a: number, v: number) => {
			const col = data.map((d) => d[a]).filter((v) => v !== undefined);
			const lo = Math.min(...col);
			const hi = Math.max(...col);
			const span = hi - lo || 1;
			return local.height - 28 - ((v - lo) / span) * (local.height - 48);
		};
		return {
			nAxes,
			x,
			lines: data.map((d) =>
				d
					.slice(0, nAxes)
					.map((v, a) => `${x(a)},${yOf(a, v)}`)
					.join(" "),
			),
		};
	};

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				class="h-52 w-full"
				viewBox={`0 0 ${local.width} ${local.height}`}
				role="img"
				aria-label="Parallel coordinates"
			>
				<For each={Array.from({ length: view().nAxes })}>
					{(_, a) => (
						<g>
							<line
								x1={view().x(a())}
								x2={view().x(a())}
								y1={20}
								y2={local.height - 28}
								stroke="currentColor"
								class="text-border"
							/>
							<text x={view().x(a())} y={12} text-anchor="middle" font-size="9" class="fill-muted-foreground">
								{local.axes?.[a()] ?? `A${a() + 1}`}
							</text>
						</g>
					)}
				</For>
				<For each={view().lines}>
					{(pts) => (
						<polyline
							points={pts}
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="text-primary"
							opacity="0.45"
							stroke-linejoin="round"
						/>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
