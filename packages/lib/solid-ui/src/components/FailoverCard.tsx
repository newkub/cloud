/**
 * FailoverCard - primary/replica pair with health dots, last sync, and a switch hint.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface FailoverNode {
	/** Instance name, e.g. "db-us-east-1a". */
	name: string;
	/** Health word — healthy/degraded/down/... (unknown words render muted). */
	status: string;
}

export interface FailoverCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Primary (active) instance. */
	primary: FailoverNode;
	/** Replica (standby) instance. */
	replica: FailoverNode;
	/** Last replication sync — Date, epoch ms, or a preformatted string. */
	lastSyncAt?: Date | number | string;
	/** Override the switch hint text. */
	switchHint?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const HEALTHY = ["healthy", "ok", "active", "running", "ready", "in-sync", "synced"];
const DEGRADED = ["degraded", "syncing", "lagging", "warn", "warning", "stale"];
const DOWN = ["down", "failed", "error", "critical", "unhealthy", "offline"];

type Tone = "success" | "warning" | "destructive" | "muted";

const healthTone = (status?: string): Tone => {
	const s = (status ?? "").toLowerCase();
	if (HEALTHY.includes(s)) return "success";
	if (DEGRADED.includes(s)) return "warning";
	if (DOWN.includes(s)) return "destructive";
	return "muted";
};

const dotCls: Record<Tone, string> = {
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	muted: "bg-muted-foreground",
};

const textCls: Record<Tone, string> = {
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	muted: "text-muted-foreground",
};

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

const formatSync = (value: Date | number | string) =>
	typeof value === "string" ? value : new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function NodeRow(p: { tag: string; node?: FailoverNode }) {
	const tone = () => healthTone(p.node?.status);
	return (
		<div class="flex items-center gap-2.5">
			<span class={`h-2.5 w-2.5 shrink-0 rounded-full ${dotCls[tone()]}`} aria-hidden="true" />
			<div class="min-w-0 flex-1">
				<div class="truncate text-sm font-medium text-foreground">{p.node?.name}</div>
				<div class="text-2xs uppercase tracking-wider text-muted-foreground">{p.tag}</div>
			</div>
			<span class={`text-2xs font-medium uppercase ${textCls[tone()]}`}>{p.node?.status}</span>
		</div>
	);
}

export function FailoverCard(props: FailoverCardProps) {
	const [local, restProps] = splitProps(props, ["primary", "replica", "lastSyncAt", "switchHint", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-failover-card flex flex-col gap-1 border p-4 transition-shadow hover:shadow-md motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "xl" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const hint = () => {
		if (local.switchHint) return local.switchHint;
		const t = healthTone(local.primary?.status);
		return t === "destructive" || t === "warning"
			? "Failover recommended — promote replica"
			: "Replica ready for failover";
	};

	return (
		<div class={className()} {...rest}>
			<NodeRow tag="Primary" node={local.primary} />
			<div class="flex items-center gap-2 py-0.5 pl-1 text-muted-foreground" aria-hidden="true">
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-3.5 w-3.5"
				>
					<path d="M7 16V4m0 0L3 8m4-4 4 4" />
					<path d="M17 8v12m0 0 4-4m-4 4-4-4" />
				</svg>
				<span class="h-px flex-1 bg-border" />
			</div>
			<NodeRow tag="Replica" node={local.replica} />
			<div class="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-2xs text-muted-foreground">
				<Show when={local.lastSyncAt !== undefined}>
					<span class="tabular-nums">Last sync {formatSync(local.lastSyncAt as Date | number | string)}</span>
				</Show>
				<span class="italic">{hint()}</span>
			</div>
			{local.children}
		</div>
	);
}
