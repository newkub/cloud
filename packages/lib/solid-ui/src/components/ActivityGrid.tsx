/**
 * ActivityGrid — GitHub-style contribution grid (weeks × days intensity cells).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ActivityGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Intensity values 0–4, row-major (rows = days of week) */
	data: number[];
	/** Number of week columns @default 26 */
	weeks?: number;
	/** Cell tone @default "primary" */
	variant?: "primary" | "success" | "info";
	/** Cell size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const cellSize = { sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3 w-3" } as const;
const levels: Record<string, string[]> = {
	primary: ["bg-muted", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"],
	success: ["bg-muted", "bg-success/25", "bg-success/50", "bg-success/75", "bg-success"],
	info: ["bg-muted", "bg-info/25", "bg-info/50", "bg-info/75", "bg-info"],
};

export function ActivityGrid(props: ActivityGridProps) {
	const [local, rest] = splitProps(props, ["class", "data", "weeks", "variant", "size", "radius", "elevation"]);
	const data = () => local.data ?? [];
	const cols = () => local.weeks ?? Math.ceil(data().length / 7);
	const cell = (w: number, d: number) => {
		const v = data()[w * 7 + d] ?? 0;
		const lv = levels[local.variant ?? "primary"];
		return lv[Math.max(0, Math.min(4, Math.round(v)))];
	};
	return (
		<div
			role="img"
			aria-label={`Activity grid: ${data().filter((v) => v > 0).length} of ${data().length} cells active`}
			class={`solidui-activity-grid inline-flex gap-0.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={Array.from({ length: cols() }, (_, w) => w)}>
				{(w) => (
					<div class="flex flex-col gap-0.5">
						<For each={Array.from({ length: 7 }, (_, d) => d)}>
							{(d) => (
								<span
									class={`rounded-[2px] ${cellSize[local.size ?? "md"]} ${cell(w, d)} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`}
									title={`${data()[w * 7 + d] ?? 0}`}
								/>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	);
}
