import { createQuery } from "@tanstack/solid-query";
import { createMemo, createSignal, For, Show } from "solid-js";
import { type HealRecord, orpc, type RunRecord } from "../ci/api";
import { fmtTime } from "../ci/format";

export type LogsMode = "platform" | "ci" | "sample";

type LogLevel = "info" | "warn" | "error";

interface LogLine {
	id: string;
	time: number;
	level: LogLevel;
	source: string;
	message: string;
}

const LEVEL_META: Record<
	LogLevel,
	{ label: string; badge: string; dot: string }
> = {
	info: {
		label: "Info",
		badge: "border-edge bg-raise text-dim",
		dot: "bg-dim",
	},
	warn: {
		label: "Warn",
		badge: "border-warn/30 bg-warn/10 text-warn",
		dot: "bg-warn",
	},
	error: {
		label: "Error",
		badge: "border-err/30 bg-err/10 text-err",
		dot: "bg-err",
	},
};

const RUN_LEVEL: Record<RunRecord["status"], LogLevel> = {
	running: "info",
	success: "info",
	failed: "error",
	healing: "warn",
	healed: "warn",
	heal_failed: "error",
};

const HEAL_LEVEL: Record<HealRecord["status"], LogLevel> = {
	running: "info",
	pushed: "warn",
	failed: "error",
};

function runLine(run: RunRecord): LogLine {
	const tail =
		run.status === "failed" && run.failures.length > 0
			? ` · ${run.failures.length} failed command${run.failures.length === 1 ? "" : "s"}`
			: "";
	return {
		id: `run:${run.id}`,
		time: run.createdAt,
		level: RUN_LEVEL[run.status],
		source: `ci/${run.repo}`,
		message: `${run.ref} @ ${run.sha.slice(0, 7)} — ${run.status}${tail}`,
	};
}

function healLine(heal: HealRecord): LogLine {
	const tail = heal.prUrl
		? ` · PR #${heal.prNumber ?? "?"}`
		: heal.error
			? ` · ${heal.error}`
			: "";
	return {
		id: `heal:${heal.runId}`,
		time: heal.finishedAt ?? heal.startedAt,
		level: HEAL_LEVEL[heal.status],
		source: "ci/healer",
		message: `Heal ${heal.runId.slice(0, 8)} — ${heal.status} after ${heal.steps} step${heal.steps === 1 ? "" : "s"}${tail}`,
	};
}

const SAMPLE_LOGS: Array<Omit<LogLine, "time"> & { ago: number }> = [
	{
		id: "sample:1",
		ago: 35,
		level: "info",
		source: "gateway",
		message: "request completed · GET /v1/notifications · 200 · 84ms",
	},
	{
		id: "sample:2",
		ago: 28,
		level: "info",
		source: "worker",
		message: "delivery dispatched · channel=email · batch=24",
	},
	{
		id: "sample:3",
		ago: 21,
		level: "warn",
		source: "worker",
		message: "retry scheduled · provider throttled · attempt 2/5",
	},
	{
		id: "sample:4",
		ago: 14,
		level: "info",
		source: "webhook",
		message: "subscriber ack · endpoint=/hooks/billing · 42ms",
	},
	{
		id: "sample:5",
		ago: 9,
		level: "error",
		source: "gateway",
		message: "validation failed · notification.templateId is required",
	},
	{
		id: "sample:6",
		ago: 3,
		level: "info",
		source: "worker",
		message: "digest flushed · 128 events · 0 dropped",
	},
];

const LEVELS = ["all", "info", "warn", "error"] as const;
type LevelFilter = (typeof LEVELS)[number];

export function LogsView(props: {
	mode: LogsMode;
	title?: string;
	description?: string;
}) {
	const [level, setLevel] = createSignal<LevelFilter>("all");
	const [search, setSearch] = createSignal("");
	const [live, setLive] = createSignal(true);
	const [copied, setCopied] = createSignal(false);

	const enabled = () => props.mode !== "sample";

	const runs = createQuery(() => ({
		queryKey: ["logs", "runs"],
		queryFn: () => orpc.runs.list({ limit: 50 }),
		enabled: enabled(),
		refetchInterval: live() ? 5_000 : false,
		retry: 0,
	}));
	const heals = createQuery(() => ({
		queryKey: ["logs", "heals"],
		queryFn: () => orpc.heals.list({ limit: 25 }),
		enabled: enabled(),
		refetchInterval: live() ? 5_000 : false,
		retry: 0,
	}));

	const lines = createMemo<LogLine[]>(() => {
		if (props.mode === "sample") {
			const now = Date.now();
			return SAMPLE_LOGS.map(({ ago, ...line }) => ({
				...line,
				time: now - ago * 1_000,
			}));
		}
		const runLines = (runs.data?.items ?? []).map(runLine);
		const healLines = (heals.data?.items ?? []).map(healLine);
		const merged =
			props.mode === "platform"
				? [...runLines, ...healLines]
				: healLines.concat(runLines);
		return merged.sort((a, b) => b.time - a.time);
	});

	const visible = createMemo(() => {
		const q = search().trim().toLowerCase();
		return lines().filter(
			(line) =>
				(level() === "all" || line.level === level()) &&
				(!q ||
					line.message.toLowerCase().includes(q) ||
					line.source.toLowerCase().includes(q)),
		);
	});

	const counts = createMemo(() => {
		const total = lines();
		return {
			all: total.length,
			info: total.filter((line) => line.level === "info").length,
			warn: total.filter((line) => line.level === "warn").length,
			error: total.filter((line) => line.level === "error").length,
		};
	});

	const loading = () => enabled() && (runs.isPending || heals.isPending);
	const failed = () => enabled() && runs.isError && heals.isError;

	function asText() {
		return visible()
			.map(
				(line) =>
					`${new Date(line.time).toISOString()}  ${line.level.toUpperCase().padEnd(5)}  ${line.source.padEnd(14)}  ${line.message}`,
			)
			.join("\n");
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(asText());
			setCopied(true);
			setTimeout(() => setCopied(false), 1_500);
		} catch {
			setCopied(false);
		}
	}

	function download() {
		const blob = new Blob([asText()], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "wrikka-logs.txt";
		anchor.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div class="space-y-4">
			<div>
				<h2 class="text-sm font-medium text-fg">{props.title ?? "Logs"}</h2>
				<p class="mt-1 text-sm text-dim">
					{props.description ??
						"Stream of events emitted by this app. Filter by severity or search the message text."}
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<div class="flex rounded-lg border border-edge bg-ink p-0.5">
					<For each={LEVELS}>
						{(option) => (
							<button
								type="button"
								onClick={() => setLevel(option)}
								class={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
									level() === option
										? "bg-raise text-fg"
										: "text-faint hover:text-dim"
								}`}
							>
								{option}
								<span class="ml-1 tabular-nums text-faint">
									{counts()[option]}
								</span>
							</button>
						)}
					</For>
				</div>
				<label class="flex min-w-48 flex-1 items-center gap-2 rounded-lg border border-edge bg-ink px-2.5 py-1.5 text-sm focus-within:border-acc/50">
					<span class="i-mdi:magnify text-faint" />
					<input
						type="text"
						value={search()}
						onInput={(event) => setSearch(event.currentTarget.value)}
						placeholder="Filter logs"
						aria-label="Filter logs"
						class="w-full bg-transparent text-sm text-fg outline-none placeholder:text-faint"
					/>
				</label>
				<Show when={enabled()}>
					<button
						type="button"
						onClick={() => setLive((value) => !value)}
						aria-pressed={live()}
						class={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
							live()
								? "border-ok/30 bg-ok/10 text-ok"
								: "border-edge text-faint hover:text-dim"
						}`}
					>
						<span
							class={`h-1.5 w-1.5 rounded-full ${
								live() ? "animate-pulse bg-ok" : "bg-current"
							}`}
						/>
						Live
					</button>
				</Show>
				<button
					type="button"
					onClick={copy}
					class="inline-flex items-center gap-1.5 rounded-lg border border-edge px-2.5 py-1.5 text-xs text-dim hover:bg-raise hover:text-fg"
				>
					<span class="i-mdi:content-copy text-sm" />
					{copied() ? "Copied" : "Copy"}
				</button>
				<button
					type="button"
					onClick={download}
					class="inline-flex items-center gap-1.5 rounded-lg border border-edge px-2.5 py-1.5 text-xs text-dim hover:bg-raise hover:text-fg"
				>
					<span class="i-mdi:download text-sm" />
					Export
				</button>
			</div>

			<Show when={failed()}>
				<p class="rounded-lg border border-err/30 bg-err/10 px-3 py-2 text-sm text-err">
					The CI API is unreachable — connect an endpoint in Settings to stream
					logs.
				</p>
			</Show>

			<div class="overflow-hidden rounded-xl border border-edge bg-ink">
				<div class="flex items-center gap-2 border-b border-edge px-4 py-2 text-[11px] uppercase tracking-wider text-faint">
					<span class="flex-1">Time · Level · Source · Message</span>
					<span class="tabular-nums">{visible().length} lines</span>
				</div>
				<Show
					when={!loading()}
					fallback={
						<div class="space-y-2 p-4" role="status" aria-busy="true">
							<div class="h-4 w-2/3 animate-pulse rounded bg-raise" />
							<div class="h-4 w-1/2 animate-pulse rounded bg-raise" />
							<div class="h-4 w-3/4 animate-pulse rounded bg-raise" />
						</div>
					}
				>
					<Show
						when={visible().length > 0}
						fallback={
							<p class="px-4 py-12 text-center text-sm text-faint">
								{lines().length === 0
									? "No events yet — logs appear here as this app runs."
									: "No log lines match the current filters."}
							</p>
						}
					>
						<ul class="max-h-[28rem] overflow-y-auto font-mono text-xs">
							<For each={visible()}>
								{(line) => (
									<li class="flex items-start gap-3 border-b border-edge/60 px-4 py-2 last:border-0 hover:bg-panel/60">
										<span class="w-20 shrink-0 tabular-nums text-faint">
											{fmtTime(line.time)}
										</span>
										<span
											class={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] uppercase ${LEVEL_META[line.level].badge}`}
										>
											<span
												class={`h-1 w-1 rounded-full ${LEVEL_META[line.level].dot}`}
											/>
											{LEVEL_META[line.level].label}
										</span>
										<span class="w-28 shrink-0 truncate text-dim">
											{line.source}
										</span>
										<span class="min-w-0 flex-1 break-words text-fg">
											{line.message}
										</span>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</Show>
			</div>
		</div>
	);
}
