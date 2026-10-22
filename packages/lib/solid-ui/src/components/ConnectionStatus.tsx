/**
 * ConnectionStatus — live connection state indicator (ws/sse/online) with dot + label.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type ConnectionState = "online" | "connecting" | "offline" | "error";

const stateMap: Record<ConnectionState, { dot: string; label: string }> = {
	online: { dot: "bg-success", label: "Connected" },
	connecting: { dot: "bg-warning", label: "Connecting…" },
	offline: { dot: "bg-muted-foreground", label: "Offline" },
	error: { dot: "bg-destructive", label: "Connection error" },
};

export interface ConnectionStatusProps extends JSX.HTMLAttributes<HTMLDivElement> {
	status: ConnectionState;
	/** Override the default state label. */
	label?: string;
	/** Extra detail line — latency, endpoint, retry count. */
	detail?: string;
	/** Pulse the dot while connecting. @default true */
	pulse?: boolean;
	/** Render as a bordered chip instead of bare text. */
	variant?: "bare" | "chip";
	size?: "sm" | "md" | "lg";
	/** Corner radius (chip variant). */
	radius?: Radius;
}

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;
const dotSize = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const;

export function ConnectionStatus(props: ConnectionStatusProps) {
	const [local, rest] = splitProps(props, ["class", "status", "label", "detail", "pulse", "variant", "size", "radius"]);
	const state = () => stateMap[local.status ?? "offline"];
	const pulsing = () => (local.pulse ?? true) && local.status === "connecting";
	return (
		<div
			role="status"
			class={`solidui-connection-status inline-flex items-center gap-2 ${textSize[local.size ?? "md"]} ${
				local.variant === "chip"
					? `border border-border bg-surface px-2.5 py-1 ${radiusMap[local.radius ?? "full"]}`
					: ""
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="relative flex" aria-hidden="true">
				<Show when={pulsing()}>
					<span
						class={`absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full opacity-60 ${state().dot}`}
					/>
				</Show>
				<span class={`relative inline-flex rounded-full ${dotSize[local.size ?? "md"]} ${state().dot}`} />
			</span>
			<span class="text-foreground">{local.label ?? state().label}</span>
			<Show when={local.detail}>
				<span class="tabular-nums text-muted-foreground">{local.detail}</span>
			</Show>
		</div>
	);
}
