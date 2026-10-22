/**
 * DiffViewer — line-based diff with +/−/context rows.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DiffLine {
	/** Line kind — add/remove/context */
	type: "add" | "remove" | "context";
	text: string;
}

export interface DiffViewerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lines: DiffLine[];
	/** Show line numbers @default true */
	lineNumbers?: boolean;
	/** Row density @default "md" */
	size?: "sm" | "md";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const rowClass: Record<DiffLine["type"], string> = {
	add: "bg-success/10 text-success",
	remove: "bg-destructive/10 text-destructive",
	context: "text-muted-foreground",
};
const sign: Record<DiffLine["type"], string> = { add: "+", remove: "−", context: " " };

export function DiffViewer(props: DiffViewerProps) {
	const [local, rest] = splitProps(props, ["class", "lines", "lineNumbers", "size", "radius", "elevation"]);
	let lineNo = 0;
	return (
		<div
			class={`solidui-diff-viewer max-h-96 overflow-auto border border-border bg-surface font-mono ${local.size === "sm" ? "text-2xs" : "text-xs"} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.lines}>
				{(line) => {
					lineNo += 1;
					const n = lineNo;
					return (
						<div class={`flex ${rowClass[line.type]}`}>
							{(local.lineNumbers ?? true) ? (
								<span class="w-10 shrink-0 select-none border-r border-border/50 px-2 text-right opacity-60">{n}</span>
							) : null}
							<span class="w-5 shrink-0 select-none text-center">{sign[line.type]}</span>
							<span class="whitespace-pre px-1 py-0.5">{line.text}</span>
						</div>
					);
				}}
			</For>
		</div>
	);
}
