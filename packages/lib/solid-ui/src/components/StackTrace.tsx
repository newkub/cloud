/**
 * StackTrace — formatted error stack with frame highlighting.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StackFrame {
	/** Raw line, or parsed parts. */
	raw?: string;
	fn?: string;
	file?: string;
	line?: number;
	column?: number;
}

export interface StackTraceProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Raw stack string (split on newlines) or parsed frames. */
	stack: string | StackFrame[];
	/** Header line — e.g. "TypeError: x is not a function". */
	title?: string;
	/** Cap rendered frames. @default 20 */
	maxFrames?: number;
	/** Dim frames matching this pattern (e.g. "node_modules"). */
	dimPattern?: string | RegExp;
	/** Frame click — receives the parsed frame. */
	onFrameClick?: (frame: StackFrame) => void;
	size?: "sm" | "md";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const textSize = { sm: "text-2xs", md: "text-xs" } as const;

/** Parse a V8-style stack line into parts. */
export function parseFrame(line: string): StackFrame {
	const m =
		line.trim().match(/^at\s+(.*?)\s*\(?(.+?):(\d+):(\d+)\)?$/) ?? line.trim().match(/^at\s+(.+?):(\d+):(\d+)$/);
	if (!m) return { raw: line };
	if (m.length === 5) return { fn: m[1], file: m[2], line: Number(m[3]), column: Number(m[4]) };
	return { file: m[1], line: Number(m[2]), column: Number(m[3]) };
}

export function StackTrace(props: StackTraceProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"stack",
		"title",
		"maxFrames",
		"dimPattern",
		"onFrameClick",
		"size",
		"radius",
		"elevation",
	]);
	const frames = () => {
		const stack = local.stack;
		const list = Array.isArray(stack)
			? stack
			: (stack ?? "")
					.split("\n")
					.filter((l) => l.trim())
					.map(parseFrame);
		return list.slice(0, local.maxFrames ?? 20);
	};
	const dimmed = (f: StackFrame) => {
		const p = local.dimPattern;
		if (!p) return false;
		const target = `${f.file ?? ""} ${f.fn ?? ""} ${f.raw ?? ""}`;
		return typeof p === "string" ? target.includes(p) : p.test(target);
	};

	return (
		<div
			class={`solidui-stack-trace max-h-96 overflow-auto border border-border bg-surface font-mono ${textSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title}>
				<div class="border-b border-border px-3 py-2 font-semibold text-destructive">{local.title}</div>
			</Show>
			<div class="divide-y divide-border/40">
				<For each={frames()}>
					{(f) => (
						// biome-ignore lint/a11y/noStaticElementInteractions: role/tabindex applied only when clickable
						<div
							role={local.onFrameClick ? "button" : undefined}
							tabIndex={local.onFrameClick ? 0 : undefined}
							class={`flex gap-3 px-3 py-1.5 ${dimmed(f) ? "text-muted-foreground/60" : "text-foreground"} ${
								local.onFrameClick
									? "cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									: ""
							}`.trim()}
							onClick={() => local.onFrameClick?.(f)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									local.onFrameClick?.(f);
								}
							}}
						>
							<span class="min-w-0 flex-1 truncate">
								<Show when={f.fn}>
									<span class="text-foreground">{f.fn} </span>
								</Show>
								{f.raw ?? (
									<>
										<span class="text-muted-foreground">{f.file}</span>
										<span class="text-primary">
											:{f.line}:{f.column}
										</span>
									</>
								)}
							</span>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
