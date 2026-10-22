/**
 * ContainerRow - container status row with health dot, image tag, and cpu/mem metrics.
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

export type ContainerStatus = "running" | "exited" | "paused";

export interface ContainerRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Container name. */
	name: string;
	/** Image tag, e.g. "nginx:1.27-alpine". */
	image: string;
	status: ContainerStatus;
	/** Human uptime, e.g. "3h 12m". */
	uptime?: string;
	/** CPU % — numbers render with a "%" suffix. */
	cpu?: string | number;
	/** Memory — numbers render with a "MB" suffix. */
	mem?: string | number;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const statusMap: Record<ContainerStatus, { dot: string; text: string; label: string }> = {
	running: { dot: "bg-success", text: "text-success", label: "Running" },
	exited: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Exited" },
	paused: { dot: "bg-warning", text: "text-warning", label: "Paused" },
};

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

const fmtCpu = (v: string | number) => (typeof v === "number" ? `${v}%` : v);
const fmtMem = (v: string | number) => (typeof v === "number" ? `${v}MB` : v);

export function ContainerRow(props: ContainerRowProps) {
	const [local, restProps] = splitProps(props, ["name", "image", "status", "uptime", "cpu", "mem", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-container-row flex items-center gap-3 border px-3 py-2 transition-colors hover:bg-muted/40 motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const st = () => statusMap[local.status ?? "exited"];
	return (
		<div class={className()} {...rest}>
			<span class="relative inline-flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
				<Show when={local.status === "running"}>
					<span class="absolute inline-flex h-full w-full rounded-full bg-success opacity-50 motion-safe:animate-ping" />
				</Show>
				<span class={`relative inline-flex h-2.5 w-2.5 rounded-full ${st().dot}`} />
			</span>
			<div class="min-w-0 flex-1">
				<div class="flex items-baseline gap-2">
					<span class="truncate text-sm font-medium text-foreground">{local.name}</span>
					<span class={`text-2xs font-medium uppercase ${st().text}`}>{local.status}</span>
				</div>
				<div class="truncate font-mono text-2xs text-muted-foreground">{local.image}</div>
			</div>
			<div class="flex shrink-0 items-center gap-3 text-2xs">
				<Show when={local.cpu !== undefined}>
					<span>
						<span class="text-muted-foreground">CPU </span>
						<span class="font-mono tabular-nums text-foreground">{fmtCpu(local.cpu as string | number)}</span>
					</span>
				</Show>
				<Show when={local.mem !== undefined}>
					<span>
						<span class="text-muted-foreground">MEM </span>
						<span class="font-mono tabular-nums text-foreground">{fmtMem(local.mem as string | number)}</span>
					</span>
				</Show>
				<Show when={local.uptime}>
					<span class="text-muted-foreground tabular-nums">{local.uptime}</span>
				</Show>
			</div>
			{local.children}
		</div>
	);
}
