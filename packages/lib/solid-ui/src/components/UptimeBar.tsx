/**
 * UptimeBar - N-day availability strip (status page pattern).
 */
import { For, type JSX, splitProps } from "solid-js";

export type DayStatus = "up" | "degraded" | "down" | "unknown";

export interface UptimeBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Per-day status, oldest → newest. */
	days: DayStatus[];
	/** Accessible label. @default "Uptime" */
	label?: string;
}

const tone: Record<DayStatus, string> = {
	up: "bg-success",
	degraded: "bg-warning",
	down: "bg-destructive",
	unknown: "bg-muted",
};

export function UptimeBar(props: UptimeBarProps) {
	const [local, rest] = splitProps(props, ["class", "days", "label"]);

	const className = () => ["solidui-uptime-bar flex items-end gap-0.5", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} role="img" aria-label={local.label ?? "Uptime"} {...rest}>
			<For each={local.days}>
				{(d, i) => <span class={`h-6 w-1.5 rounded-sm ${tone[d]}`} title={`Day ${i() + 1}: ${d}`} />}
			</For>
		</div>
	);
}
