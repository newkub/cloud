/**
 * CoverageChart — overall coverage area gauge with a per-file bar list.
 */
import { For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CoverageFile {
	/** File name */
	name: string;
	/** Coverage percent 0..100 */
	pct: number;
}

export interface CoverageChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Overall coverage percent 0..100 */
	overall: number;
	/** Per-file coverage bars @default [] */
	files?: CoverageFile[];
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 80 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 10;

export function CoverageChart(props: CoverageChartProps) {
	const merged = mergeProps({ width: 320, height: 80, files: [] }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"overall",
		"files",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const base = () => local.height - PAD_BOTTOM;
	const pct = () => Math.min(100, Math.max(0, local.overall));
	const y = () => base() - (pct() / 100) * (base() - PAD_TOP);
	const area = () =>
		`M${PAD_X},${base()} L${PAD_X},${y().toFixed(1)} L${local.width - PAD_X},${y().toFixed(1)} L${local.width - PAD_X},${base()} Z`;

	return (
		<div
			class={[
				"solidui-coverage-chart w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				class="h-20 w-full"
				viewBox={`0 0 ${local.width} ${local.height}`}
				role="img"
				aria-label={`Coverage: ${pct()}% overall`}
			>
				<line
					x1={PAD_X}
					y1={PAD_TOP}
					x2={local.width - PAD_X}
					y2={PAD_TOP}
					class="stroke-border"
					stroke-width="1"
					stroke-dasharray="3 3"
				/>
				<path d={area()} class="fill-primary/15" />
				<line
					x1={PAD_X}
					y1={y()}
					x2={local.width - PAD_X}
					y2={y()}
					class="stroke-primary"
					stroke-width="2"
					stroke-linecap="round"
				/>
				<text
					x={local.width - PAD_X}
					y={y() - 4}
					text-anchor="end"
					font-size="10"
					class="fill-primary font-semibold tabular-nums"
				>
					{pct()}%
				</text>
			</svg>
			<Show when={local.files.length > 0}>
				<div class="mt-2 flex flex-col gap-1.5">
					<For each={local.files}>
						{(f) => (
							<div class="flex items-center gap-2">
								<span class="w-28 truncate text-2xs text-muted-foreground">{f.name}</span>
								<div class="h-1.5 flex-1 rounded-sm bg-muted">
									<div
										class="h-full rounded-sm bg-primary"
										style={{ width: `${Math.min(100, Math.max(0, f.pct))}%` }}
									/>
								</div>
								<span class="w-9 text-right text-2xs text-foreground tabular-nums">{f.pct}%</span>
							</div>
						)}
					</For>
				</div>
			</Show>
			{local.children}
		</div>
	);
}
