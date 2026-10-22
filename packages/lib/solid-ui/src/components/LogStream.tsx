/**
 * LogStream — live-tail log: level-colored rows, level filter chips,
 * autoscroll toggle and pause. Streaming counterpart to LogViewer.
 */
import { createEffect, createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface StreamLine {
	/** Severity — picks the row accent. @default "info" */
	level?: "trace" | "debug" | "info" | "warn" | "error";
	msg: string;
	/** Timestamp prefix */
	ts?: string;
}

export interface LogStreamProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onPause"> {
	lines: StreamLine[];
	/** Controlled paused state. Omit to manage internally. */
	paused?: boolean;
	/** Called when the pause/resume button is pressed. */
	onPause?: (paused: boolean) => void;
	/** Viewport height in px. @default 240 */
	maxHeight?: number;
	/** Corner radius. */
	radius?: Radius;
}

const LEVELS = ["trace", "debug", "info", "warn", "error"] as const;
type Level = (typeof LEVELS)[number];

const levelClass: Record<Level, string> = {
	trace: "text-muted-foreground/70",
	debug: "text-muted-foreground",
	info: "text-info",
	warn: "text-warning",
	error: "text-destructive",
};

const chipOn = "border-border bg-muted text-foreground";
const chipOff = "border-border/50 bg-transparent text-muted-foreground/50 line-through";

export function LogStream(props: LogStreamProps) {
	const [local, rest] = splitProps(props, ["class", "lines", "paused", "onPause", "maxHeight", "radius"]);
	const [internalPaused, setInternalPaused] = createSignal(false);
	const [autoscroll, setAutoscroll] = createSignal(true);
	const [hidden, setHidden] = createSignal<Set<Level>>(new Set());
	let viewport: HTMLDivElement | undefined;

	const paused = () => local.paused ?? internalPaused();
	const visible = () => (local.lines ?? []).filter((l) => !hidden().has((l.level ?? "info") as Level));
	const present = () => LEVELS.filter((lv) => (local.lines ?? []).some((l) => (l.level ?? "info") === lv));

	const togglePause = () => {
		const next = !paused();
		setInternalPaused(next);
		local.onPause?.(next);
	};
	const toggleLevel = (lv: Level) =>
		setHidden((s) => {
			const next = new Set(s);
			if (next.has(lv)) next.delete(lv);
			else next.add(lv);
			return next;
		});

	createEffect(() => {
		local.lines;
		if (autoscroll() && !paused() && viewport) viewport.scrollTop = viewport.scrollHeight;
	});

	const toolBtn =
		"inline-flex h-6 items-center rounded border border-border px-2 font-mono text-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

	return (
		<div
			class={`solidui-log-stream overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex flex-wrap items-center gap-1.5 border-b border-border px-2 py-1.5">
				<For each={present()}>
					{(lv) => (
						<button
							type="button"
							class={`${toolBtn} ${hidden().has(lv) ? chipOff : chipOn}`}
							aria-pressed={!hidden().has(lv)}
							aria-label={`Toggle ${lv} lines`}
							onClick={() => toggleLevel(lv)}
						>
							{lv}
						</button>
					)}
				</For>
				<span class="flex-1" />
				<button
					type="button"
					class={`${toolBtn} ${autoscroll() ? "text-info" : "text-muted-foreground"}`}
					aria-pressed={autoscroll()}
					onClick={() => setAutoscroll((v) => !v)}
				>
					Autoscroll
				</button>
				<button
					type="button"
					class={`${toolBtn} ${paused() ? "text-warning" : "text-muted-foreground"}`}
					aria-pressed={paused()}
					onClick={togglePause}
				>
					{paused() ? "Resume" : "Pause"}
				</button>
			</div>
			<div
				ref={viewport}
				class="overflow-y-auto font-mono text-xs"
				style={{ "max-height": `${local.maxHeight ?? 240}px` }}
				role="log"
				aria-live={paused() ? "off" : "polite"}
			>
				<For each={visible()}>
					{(line) => (
						<div class="flex gap-2 border-b border-border/50 px-3 py-1 last:border-0 hover:bg-muted/40">
							{line.ts ? <span class="shrink-0 text-muted-foreground/60">{line.ts}</span> : null}
							<span class={`w-10 shrink-0 uppercase ${levelClass[(line.level ?? "info") as Level]}`}>
								{line.level ?? "info"}
							</span>
							<span class="min-w-0 flex-1 whitespace-pre-wrap text-foreground/90">{line.msg}</span>
						</div>
					)}
				</For>
				<Show when={visible().length === 0}>
					<p class="m-0 px-3 py-2 text-muted-foreground">No log lines.</p>
				</Show>
			</div>
		</div>
	);
}
