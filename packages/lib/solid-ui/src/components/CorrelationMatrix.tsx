/**
 * CorrelationMatrix — colored grid of pairwise coefficients (-1..1 diverging scale).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CorrelationMatrixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Variable labels — order matches `values` rows. */
	labels?: string[];
	/** N×N matrix of coefficients in -1..1. */
	values?: number[][];
	radius?: Radius;
	elevation?: Elevation;
}

const cellColor = (v: number) =>
	v >= 0
		? `color-mix(in oklab, var(--color-primary) ${Math.round(v * 100)}%, transparent)`
		: `color-mix(in oklab, var(--color-destructive) ${Math.round(-v * 100)}%, transparent)`;

export function CorrelationMatrix(props: CorrelationMatrixProps) {
	const [local, rest] = splitProps(props, ["class", "children", "labels", "values", "radius", "elevation"]);

	return (
		<div
			class={[
				"w-full overflow-x-auto",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<table class="border-collapse" aria-label="Correlation matrix">
				<thead>
					<tr>
						<th />
						<For each={local.labels ?? []}>
							{(l) => <th class="p-1 text-2xs font-medium text-muted-foreground">{l}</th>}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={local.values ?? []}>
						{(row, r) => (
							<tr>
								<th class="p-1 pr-2 text-right text-2xs font-medium text-muted-foreground">{local.labels?.[r()]}</th>
								<For each={row}>
									{(v) => (
										<td class="p-0.5">
											<span
												class="block h-7 w-7 rounded-sm"
												style={{ "background-color": cellColor(v) }}
												title={v.toFixed(2)}
											/>
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
			{local.children}
		</div>
	);
}
