/**
 * LogPatternCard - aggregated log pattern row with count, level tone, and mini bars.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type LogLevel = "info" | "warn" | "error";

export interface LogPatternCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Normalized log pattern, e.g. "GET /api/* → 502". */
	pattern: string;
	/** Occurrence count. */
	count: number;
	level: LogLevel;
	/** Optional occurrence sparkline — rendered as mini bars. */
	spark?: number[];
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const levelMap: Record<LogLevel, { text: string; fill: string; label: string }> = {
	info: { text: "text-info", fill: "bg-info", label: "INFO" },
	warn: { text: "text-warning", fill: "bg-warning", label: "WARN" },
	error: { text: "text-destructive", fill: "bg-destructive", label: "ERROR" },
};

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

export function LogPatternCard(props: LogPatternCardProps) {
	const [local, restProps] = splitProps(props, ["pattern", "count", "level", "spark", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-log-pattern-card flex items-center gap-3 border p-3 transition-colors hover:bg-muted/40 motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const lv = () => levelMap[local.level ?? "info"];
	const max = () => Math.max(1, ...(local.spark ?? []));
	return (
		<div class={className()} {...rest}>
			<span class={`h-2 w-2 shrink-0 rounded-full ${lv().fill}`} aria-hidden="true" />
			<div class="min-w-0 flex-1">
				<code class="block truncate font-mono text-xs text-foreground">{local.pattern}</code>
				<span class={`text-2xs font-semibold uppercase ${lv().text}`}>{lv().label}</span>
			</div>
			<Show when={(local.spark?.length ?? 0) > 0}>
				<div class={`flex h-7 shrink-0 items-end gap-0.5 ${lv().text}`} aria-hidden="true">
					<For each={local.spark}>
						{(v) => (
							<span
								class="w-1 rounded-sm bg-current"
								style={{ height: `${Math.max(8, Math.round((v / max()) * 100))}%` }}
							/>
						)}
					</For>
				</div>
			</Show>
			<div class="shrink-0 text-right">
				<div class="font-mono text-base font-semibold tabular-nums text-foreground">
					{(local.count ?? 0).toLocaleString()}
				</div>
				<div class="text-2xs text-muted-foreground">events</div>
			</div>
			{local.children}
		</div>
	);
}
