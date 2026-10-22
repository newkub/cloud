/**
 * SizeGuide - measurement table for apparel/commerce size selection.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SizeGuideProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Column headers, e.g. ["Size", "Chest", "Length"]. */
	columns: string[];
	/** Row cells matching the column count. */
	rows: string[][];
	/** Currently selected row index — highlights it. */
	selected?: number;
	/** Called with the row index on click (selectable mode). */
	onSelect?: (index: number) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function SizeGuide(props: SizeGuideProps) {
	const [local, rest] = splitProps(props, ["class", "columns", "rows", "selected", "onSelect", "radius"]);

	const className = () =>
		["solidui-size-guide overflow-x-auto border border-border", radiusMap[local.radius ?? "md"], local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/50">
						<For each={local.columns}>
							{(c) => <th class="px-3 py-2 text-left font-medium text-muted-foreground">{c}</th>}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={local.rows}>
						{(row, i) => (
							<tr
								class={`border-b border-border last:border-0 ${local.onSelect ? "cursor-pointer" : ""} ${
									local.selected === i() ? "bg-accent" : local.onSelect ? "hover:bg-accent/50" : ""
								}`}
								onClick={() => local.onSelect?.(i())}
								aria-selected={local.onSelect ? local.selected === i() : undefined}
							>
								<For each={row}>
									{(cell, ci) => (
										<td class={`px-3 py-2 ${ci() === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
											{cell}
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
