/**
 * BatteryMeter — battery icon with fill percent, level text and charging bolt state.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface BatteryMeterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Charge level, clamped to 0–100 */
	level: number;
	/** Show the charging bolt @default false */
	charging?: boolean;
	/** Accessible label @default "Battery" */
	label?: string;
	/** Show the numeric level text @default true */
	showValue?: boolean;
}

export function BatteryMeter(props: BatteryMeterProps) {
	const [local, rest] = splitProps(props, ["class", "level", "charging", "label", "showValue"]);
	const clamped = () => Math.max(0, Math.min(100, local.level));
	const fillCls = () => (clamped() <= 20 ? "bg-destructive" : clamped() <= 50 ? "bg-warning" : "bg-success");
	const text = () => `${clamped()}%${local.charging ? ", charging" : ""}`;

	return (
		<div class={`solidui-battery-meter inline-flex items-center gap-2 ${local.class ?? ""}`.trim()} {...rest}>
			<div
				role="progressbar"
				aria-label={local.label ?? "Battery"}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={clamped()}
				aria-valuetext={text()}
				class="relative flex h-5 w-11 items-center rounded border-2 border-foreground/60 p-0.5"
			>
				<div
					class={`h-full rounded-[1px] transition-[width] motion-reduce:transition-none ${fillCls()}`}
					style={{ width: `${clamped()}%` }}
				/>
				<Show when={local.charging}>
					<svg
						class="absolute inset-0 m-auto h-3 w-3 text-foreground"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
					</svg>
				</Show>
				<span
					class="absolute -right-1.5 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r-sm bg-foreground/60"
					aria-hidden="true"
				/>
			</div>
			<Show when={local.showValue ?? true}>
				<span class="text-xs font-medium tabular-nums text-muted-foreground">{text()}</span>
			</Show>
		</div>
	);
}
