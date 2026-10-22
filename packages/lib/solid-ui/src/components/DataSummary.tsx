/**
 * DataSummary — totals row list (subtotal / shipping / total pattern).
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface DataSummaryRow {
	/** Row label */
	label: string;
	/** Row value */
	value: string | number;
	/** Small hint under the label */
	hint?: string;
	/** Emphasize the row (e.g. the grand total) */
	emphasize?: boolean;
}

export interface DataSummaryProps extends JSX.HTMLAttributes<HTMLDListElement> {
	/** Label/value rows in display order */
	rows: DataSummaryRow[];
	/** Row index to draw a total divider before */
	dividerBefore?: number;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
}

const sizeClass = {
	sm: "gap-1 text-xs",
	md: "gap-1.5 text-sm",
	lg: "gap-2 text-base",
} as const;

export function DataSummary(props: DataSummaryProps) {
	const [local, rest] = splitProps(props, ["class", "rows", "dividerBefore", "size"]);
	return (
		<dl
			class={`solidui-data-summary flex flex-col ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.rows ?? []}>
				{(row, index) => (
					<>
						<Show when={local.dividerBefore === index()}>
							<div class="my-1.5 border-t border-border" aria-hidden="true" />
						</Show>
						<div class="flex items-baseline justify-between gap-4">
							<dt class="min-w-0">
								<span class={row.emphasize ? "font-semibold text-foreground" : "text-muted-foreground"}>
									{row.label}
								</span>
								<Show when={row.hint}>
									<span class="block text-2xs text-muted-foreground">{row.hint}</span>
								</Show>
							</dt>
							<dd
								class={`shrink-0 tabular-nums ${row.emphasize ? "font-bold text-foreground" : "font-medium text-foreground"}`}
							>
								{row.value}
							</dd>
						</div>
					</>
				)}
			</For>
		</dl>
	);
}
