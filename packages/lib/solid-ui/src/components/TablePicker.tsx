/**
 * TablePicker — hoverable N×N grid picker. Hovering or focusing a cell
 * highlights the rectangle up to it and shows a live "rows × cols" label;
 * activating a cell calls `onInsert(rows, cols)`.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface TablePickerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Maximum rows/columns in the grid. @default 8 */
	max?: number;
	/** Called with the selected table size. */
	onInsert?: (rows: number, cols: number) => void;
	/** Corner radius on the panel. */
	radius?: Radius;
}

export function TablePicker(props: TablePickerProps) {
	const [local, rest] = splitProps(props, ["class", "max", "onInsert", "radius"]);
	const [hover, setHover] = createSignal<{ r: number; c: number }>({ r: 0, c: 0 });
	const max = () => Math.max(1, local.max ?? 8);
	const indexes = () => Array.from({ length: max() }, (_, i) => i);
	const label = () => (hover().r > 0 ? `${hover().r} × ${hover().c}` : "Select size");

	return (
		<div
			class={`solidui-table-picker inline-flex flex-col gap-2 border border-border bg-surface p-2 ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{/* biome-ignore lint/a11y/useSemanticElements: grid-picker, not a data grid */}
			<div
				role="group"
				aria-label="Choose table size"
				onMouseLeave={() => setHover({ r: 0, c: 0 })}
				style={{ "grid-template-columns": `repeat(${max()}, minmax(0, 1fr))` }}
				class="grid gap-0.5"
			>
				<For each={indexes()}>
					{(r) => (
						<For each={indexes()}>
							{(c) => (
								<button
									type="button"
									aria-label={`Insert ${r + 1} by ${c + 1} table`}
									onMouseEnter={() => setHover({ r: r + 1, c: c + 1 })}
									onFocus={() => setHover({ r: r + 1, c: c + 1 })}
									onClick={() => local.onInsert?.(r + 1, c + 1)}
									class={`h-4 w-4 rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
										r < hover().r && c < hover().c
											? "border-primary bg-primary/20"
											: "border-border bg-background hover:border-muted-foreground"
									}`}
								/>
							)}
						</For>
					)}
				</For>
			</div>
			<p aria-live="polite" class="m-0 text-center text-xs tabular-nums text-muted-foreground">
				{label()}
			</p>
		</div>
	);
}
