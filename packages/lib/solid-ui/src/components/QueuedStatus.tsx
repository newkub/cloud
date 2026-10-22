/**
 * QueuedStatus — queue position display ("You're #3 in line") with ETA and progress.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface QueuedStatusProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current position in queue (1-based). */
	position: number;
	/** Total queue length. */
	total?: number;
	/** Estimated wait text, e.g. "~4 min". */
	eta?: string;
	title?: string;
	/** Progress bar under the text. @default true */
	showProgress?: boolean;
	/** Pulse the position number. @default true */
	animated?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const numSize = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" } as const;

export function QueuedStatus(props: QueuedStatusProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"position",
		"total",
		"eta",
		"title",
		"showProgress",
		"animated",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const frac = () => (local.total ? Math.max(0, Math.min(1, 1 - (local.position - 1) / local.total)) : 0);
	return (
		<div
			role="status"
			class={`solidui-queued-status text-center ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
				{local.title ?? "You're in the queue"}
			</div>
			<div
				class={`mt-1 font-mono font-bold tabular-nums text-primary ${numSize[local.size ?? "md"]} ${(local.animated ?? true) ? "motion-safe:animate-pulse" : ""}`}
			>
				#{local.position}
			</div>
			<Show when={local.total}>
				<div class="text-2xs text-muted-foreground">of {local.total}</div>
			</Show>
			<Show when={local.eta}>
				<div class={`mt-1 font-medium text-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
					Estimated wait: {local.eta}
				</div>
			</Show>
			<Show when={(local.showProgress ?? true) && local.total}>
				<div class="mx-auto mt-3 h-1.5 max-w-48 overflow-hidden rounded-full bg-muted">
					<div
						class="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
						style={{ width: `${frac() * 100}%` }}
					/>
				</div>
			</Show>
		</div>
	);
}
