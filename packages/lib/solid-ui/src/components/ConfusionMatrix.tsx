/**
 * ConfusionMatrix - labeled matrix heat table with opacity-scaled cells and row/column totals.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ConfusionMatrixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Class labels — shared by rows (actual) and columns (predicted). */
	labels: string[];
	/** Counts per cell — `matrix[actual][predicted]`. */
	matrix: number[][];
	/** Show a totals row and column. @default true */
	totals?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ConfusionMatrix(props: ConfusionMatrixProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-confusion-matrix inline-block overflow-auto",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const labels = () => props.labels ?? [];
	const matrix = () => props.matrix ?? [];
	const totals = () => props.totals ?? true;
	const cell = (r: number, c: number) => matrix()[r]?.[c] ?? 0;
	const max = () => Math.max(1, ...matrix().flat());
	const alpha = (v: number) => Math.round((0.08 + 0.84 * (Math.max(0, v) / max())) * 100) / 100;
	const rowTotal = (r: number) => (matrix()[r] ?? []).reduce((a, v) => a + v, 0);
	const colTotal = (c: number) => labels().reduce((a, _, r) => a + cell(r, c), 0);
	const grand = () => matrix().reduce((a, row) => a + row.reduce((b, v) => b + v, 0), 0);
	const th = "border border-border bg-muted px-2 py-1 font-medium text-muted-foreground";
	const td = "border border-border px-2 py-1 text-center tabular-nums";

	return (
		<div class={className()} {...rest}>
			<Show when={labels().length > 0} fallback={<p class="text-sm text-muted-foreground">No data</p>}>
				<table class="border-collapse text-xs">
					<caption class="mb-1 text-left text-2xs text-muted-foreground">Rows: actual · Columns: predicted</caption>
					<thead>
						<tr>
							<th class={`${th} text-left`}>Actual \ Predicted</th>
							<For each={labels()}>{(l) => <th class={th}>{l}</th>}</For>
							<Show when={totals()}>
								<th class={th}>Total</th>
							</Show>
						</tr>
					</thead>
					<tbody>
						<For each={labels()}>
							{(l, r) => (
								<tr>
									<th scope="row" class={`${th} text-left text-foreground`}>
										{l}
									</th>
									<For each={labels()}>
										{(_, c) => (
											<td
												class={`${td} text-foreground`}
												style={{
													"background-color": `hsl(var(--color-primary) / ${alpha(cell(r(), c()))})`,
												}}
											>
												{cell(r(), c())}
											</td>
										)}
									</For>
									<Show when={totals()}>
										<td class={`${td} font-medium text-muted-foreground`}>{rowTotal(r())}</td>
									</Show>
								</tr>
							)}
						</For>
						<Show when={totals()}>
							<tr>
								<th scope="row" class={`${th} text-left`}>
									Total
								</th>
								<For each={labels()}>
									{(_, c) => <td class={`${td} bg-muted/50 font-medium text-muted-foreground`}>{colTotal(c())}</td>}
								</For>
								<td class={`${td} bg-muted font-semibold text-foreground`}>{grand()}</td>
							</tr>
						</Show>
					</tbody>
				</table>
			</Show>
		</div>
	);
}
