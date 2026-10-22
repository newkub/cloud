/**
 * LogViewer — scrollable monospaced log with level-colored rows.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LogLine {
	/** Severity — picks the accent color @default "info" */
	level?: "debug" | "info" | "warn" | "error";
	/** Log text */
	text: string;
	/** Optional timestamp prefix */
	time?: string;
}

export interface LogViewerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lines: LogLine[];
	/** Max viewport height in px @default 240 */
	maxHeight?: number;
	/** Show line numbers @default true */
	lineNumbers?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const levelClass: Record<NonNullable<LogLine["level"]>, string> = {
	debug: "text-muted-foreground",
	info: "text-info",
	warn: "text-warning",
	error: "text-destructive",
};

export function LogViewer(props: LogViewerProps) {
	const [local, rest] = splitProps(props, ["class", "lines", "maxHeight", "lineNumbers", "radius", "elevation"]);
	return (
		<div
			class={`solidui-log-viewer overflow-y-auto border border-border bg-surface font-mono text-xs ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			style={{ "max-height": `${local.maxHeight ?? 240}px` }}
			role="log"
			{...rest}
		>
			<For each={local.lines}>
				{(line, i) => (
					<div class="flex gap-2 border-b border-border/50 px-3 py-1 last:border-0 hover:bg-muted/40">
						{(local.lineNumbers ?? true) ? (
							<span class="w-6 shrink-0 select-none text-right text-muted-foreground/60">{i() + 1}</span>
						) : null}
						{line.time ? <span class="shrink-0 text-muted-foreground/60">{line.time}</span> : null}
						<span class={`uppercase ${levelClass[line.level ?? "info"]}`}>{line.level ?? "info"}</span>
						<span class="min-w-0 flex-1 whitespace-pre-wrap text-foreground/90">{line.text}</span>
					</div>
				)}
			</For>
		</div>
	);
}
