/**
 * LevelBar — capacity/level bar with tick marks and threshold coloring.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type BarVariant, barVariants } from "../lib/variants";

export interface LevelBarLevel {
	/** Threshold (0–100) at or above which this color applies */
	at: number;
	/** Tone token for the threshold */
	color: "success" | "warning" | "destructive";
}

export interface LevelBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Fill level, clamped to 0–100 */
	value: number;
	/** Tick positions (0–100) drawn on the track */
	ticks?: number[];
	/** Caption above the bar */
	label?: string;
	/** Threshold coloring — highest matching `at` wins */
	levels?: LevelBarLevel[];
	/** Show the numeric value @default true */
	showValue?: boolean;
	/** Bar height @default "md" */
	size?: "sm" | "md" | "lg";
}

const barH = { sm: "h-1.5", md: "h-2.5", lg: "h-4" } as const;

export function LevelBar(props: LevelBarProps) {
	const [local, rest] = splitProps(props, ["class", "value", "ticks", "label", "levels", "showValue", "size"]);
	const clamped = () => Math.max(0, Math.min(100, local.value));
	const color = (): BarVariant => {
		const match = [...(local.levels ?? [])].filter((l) => clamped() >= l.at).sort((a, b) => b.at - a.at)[0];
		return match?.color ?? "default";
	};

	return (
		<div class={`solidui-level-bar ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.label || (local.showValue ?? true)}>
				<div class="mb-1 flex items-baseline justify-between">
					<Show when={local.label}>
						<span class="text-xs font-medium text-muted-foreground">{local.label}</span>
					</Show>
					<Show when={local.showValue ?? true}>
						<span class="ml-auto text-xs font-semibold tabular-nums text-foreground">{clamped()}%</span>
					</Show>
				</div>
			</Show>
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={clamped()}
				aria-label={local.label ?? "Level"}
				class={`relative w-full overflow-hidden rounded-full bg-muted ${barH[local.size ?? "md"]}`}
			>
				<div
					class={`h-full rounded-full transition-[width] motion-reduce:transition-none ${barVariants[color()]}`}
					style={{ width: `${clamped()}%` }}
				/>
				<For each={local.ticks ?? []}>
					{(tick) => (
						<div
							class="absolute inset-y-0 w-px bg-background/70"
							style={{ left: `${Math.max(0, Math.min(100, tick))}%` }}
							aria-hidden="true"
						/>
					)}
				</For>
			</div>
		</div>
	);
}
