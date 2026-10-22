/**
 * NetStatus — pill showing connectivity state (online/offline/slow) with a dot and latency.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type NetStatusState = "online" | "offline" | "slow";

const stateMap: Record<NetStatusState, { dot: string; label: string; text: string }> = {
	online: { dot: "bg-success", label: "Online", text: "text-foreground" },
	slow: { dot: "bg-warning", label: "Slow", text: "text-warning" },
	offline: { dot: "bg-destructive", label: "Offline", text: "text-destructive" },
};

export interface NetStatusProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Current connectivity state. */
	status: NetStatusState;
	/** Round-trip latency in milliseconds — shown when connected. */
	latency?: number;
	/** Ping the dot while a connection exists. @default true */
	pulse?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function NetStatus(props: NetStatusProps) {
	const [local, rest] = splitProps(props, ["class", "status", "latency", "pulse", "radius"]);
	const state = () => stateMap[local.status ?? "offline"];
	const pulsing = () => (local.pulse ?? true) && local.status !== "offline";
	return (
		<span
			role="status"
			class={`solidui-net-status inline-flex items-center gap-2 border border-border bg-surface px-2.5 py-1 text-xs ${radiusMap[local.radius ?? "full"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="relative flex" aria-hidden="true">
				<Show when={pulsing()}>
					<span
						class={`absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full opacity-60 ${state().dot}`}
					/>
				</Show>
				<span class={`relative inline-flex h-2 w-2 rounded-full ${state().dot}`} />
			</span>
			<span class={state().text}>{state().label}</span>
			<Show when={local.latency !== undefined && local.status !== "offline"}>
				<span class="tabular-nums text-muted-foreground">{local.latency} ms</span>
			</Show>
		</span>
	);
}
