/**
 * AnomalyTable — table of anomalous rows with a severity badge derived from the score.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface AnomalyRow {
	/** Row label. */
	label: string;
	/** Observed value. */
	value: string | number;
	/** Expected value. */
	expected: string | number;
	/** Anomaly score 0–1 — higher is more severe. */
	score: number;
}

export interface AnomalyTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Rows to render. */
	rows?: AnomalyRow[];
	/** Rendered when `rows` is empty @default "No anomalies detected" */
	empty?: JSX.Element;
	/** Score ≥ this is "high" severity @default 0.7 */
	highAt?: number;
	/** Score ≥ this is "medium" severity @default 0.4 */
	mediumAt?: number;
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const cellPad = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-sm" } as const;

export function AnomalyTable(props: AnomalyTableProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-anomaly-table overflow-hidden border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["rows", "empty", "highAt", "mediumAt", "children"]);
	const severity = (score: number) =>
		score >= (local.highAt ?? 0.7)
			? { label: "high", cls: chipVariants.destructive }
			: score >= (local.mediumAt ?? 0.4)
				? { label: "medium", cls: chipVariants.warning }
				: { label: "low", cls: chipVariants.default };
	const pad = () => cellPad[props.size ?? "md"];
	return (
		<div class={className()} {...dom}>
			<Show
				when={(local.rows ?? []).length > 0}
				fallback={
					local.empty ?? <div class="py-6 text-center text-sm text-muted-foreground">No anomalies detected</div>
				}
			>
				<table class="w-full">
					<thead>
						<tr class="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
							<th class={`font-medium ${pad()}`} scope="col">
								Label
							</th>
							<th class={`font-medium ${pad()}`} scope="col">
								Value
							</th>
							<th class={`font-medium ${pad()}`} scope="col">
								Expected
							</th>
							<th class={`font-medium ${pad()}`} scope="col">
								Score
							</th>
							<th class={`font-medium ${pad()}`} scope="col">
								Severity
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={local.rows}>
							{(row, i) => (
								<tr class={`border-b border-border/50 last:border-0 ${i() % 2 ? "bg-muted/30" : "bg-surface"}`}>
									<td class={`font-medium text-foreground ${pad()}`}>{row.label}</td>
									<td class={`tabular-nums text-foreground ${pad()}`}>{row.value}</td>
									<td class={`tabular-nums text-muted-foreground ${pad()}`}>{row.expected}</td>
									<td class={`tabular-nums text-muted-foreground ${pad()}`}>{row.score.toFixed(2)}</td>
									<td class={pad()}>
										<span
											class={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-2xs ${severity(row.score).cls}`}
										>
											{severity(row.score).label}
										</span>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</Show>
			{local.children}
		</div>
	);
}
