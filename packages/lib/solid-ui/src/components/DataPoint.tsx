/**
 * DataPoint — big number with label, optional icon, and inline spark bars.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type TextSize, textSizes } from "../lib/variants";

export interface DataPointProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Metric label */
	label: string;
	/** Metric value */
	value: string | number;
	/** Optional leading icon */
	icon?: JSX.Element;
	/** Tiny inline bar strip — one div per number */
	spark?: number[];
	/** Text alignment @default "left" */
	align?: "left" | "center";
	/** Value text size @default "2xl" */
	size?: TextSize;
}

export function DataPoint(props: DataPointProps) {
	const [local, rest] = splitProps(props, ["class", "label", "value", "icon", "spark", "align", "size"]);
	const sparkMax = () => Math.max(1, ...(local.spark ?? []));
	return (
		<div
			class={`solidui-data-point ${local.align === "center" ? "text-center" : "text-left"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`flex items-center gap-2 ${local.align === "center" ? "justify-center" : ""}`}>
				<Show when={local.icon}>
					<span class="shrink-0 text-muted-foreground" aria-hidden="true">
						{local.icon}
					</span>
				</Show>
				<span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{local.label}</span>
			</div>
			<p class={`mt-0.5 font-bold tabular-nums tracking-tight text-foreground ${textSizes[local.size ?? "2xl"]}`}>
				{local.value}
			</p>
			<Show when={(local.spark ?? []).length > 0}>
				<div
					class={`mt-1 flex h-4 items-end gap-0.5 ${local.align === "center" ? "justify-center" : ""}`}
					role="img"
					aria-label={`Sparkline for ${local.label}`}
				>
					<For each={local.spark ?? []}>
						{(n) => (
							<div
								class="w-1 rounded-sm bg-primary/70 transition-[height] motion-reduce:transition-none"
								style={{ height: `${Math.max(8, (n / sparkMax()) * 100)}%` }}
								aria-hidden="true"
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
