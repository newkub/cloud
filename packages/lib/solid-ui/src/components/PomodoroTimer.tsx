/**
 * PomodoroTimer — work/break ring countdown with start/pause/reset and cycle dots.
 * Four work rounds earn a long break.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";

export type PomodoroPhase = "work" | "break" | "longBreak";

export interface PomodoroTimerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Work session length in minutes @default 25 */
	workMin?: number;
	/** Short break length in minutes @default 5 */
	breakMin?: number;
	/** Long break length in minutes (after 4 work rounds) @default 15 */
	longBreakMin?: number;
	/** Called whenever the phase changes */
	onPhase?: (phase: PomodoroPhase) => void;
}

const ROUNDS = 4;
const ringStroke: Record<PomodoroPhase, string> = {
	work: "stroke-primary",
	break: "stroke-success",
	longBreak: "stroke-info",
};
const phaseLabel: Record<PomodoroPhase, string> = {
	work: "Focus",
	break: "Break",
	longBreak: "Long break",
};

export function PomodoroTimer(props: PomodoroTimerProps) {
	const [local, rest] = splitProps(props, ["class", "workMin", "breakMin", "longBreakMin", "onPhase"]);
	const duration = (phase: PomodoroPhase) =>
		(phase === "work"
			? (local.workMin ?? 25)
			: phase === "break"
				? (local.breakMin ?? 5)
				: (local.longBreakMin ?? 15)) * 60;

	const [phase, setPhase] = createSignal<PomodoroPhase>("work");
	const [round, setRound] = createSignal(1);
	const [completed, setCompleted] = createSignal(0);
	const [remaining, setRemaining] = createSignal(duration("work"));
	const [running, setRunning] = createSignal(false);

	const advance = () => {
		const p = phase();
		let next: PomodoroPhase;
		if (p === "work") {
			const done = completed() + 1;
			setCompleted(done);
			next = done >= ROUNDS ? "longBreak" : "break";
		} else if (p === "break") {
			setRound((r) => Math.min(ROUNDS, r + 1));
			next = "work";
		} else {
			setRound(1);
			setCompleted(0);
			next = "work";
		}
		setPhase(next);
		setRemaining(duration(next));
		local.onPhase?.(next);
	};

	onMount(() => {
		const timer = setInterval(() => {
			if (!running()) return;
			setRemaining((s) => {
				if (s <= 1) {
					queueMicrotask(advance);
					return 0;
				}
				return s - 1;
			});
		}, 1000);
		onCleanup(() => clearInterval(timer));
	});

	const reset = () => {
		setRunning(false);
		setPhase("work");
		setRound(1);
		setCompleted(0);
		setRemaining(duration("work"));
	};

	const total = () => duration(phase());
	const frac = () => (total() > 0 ? remaining() / total() : 0);
	const mmss = () => {
		const s = remaining();
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
	};
	const r = 45;
	const circ = 2 * Math.PI * r;

	return (
		<div
			class={`solidui-pomodoro-timer inline-flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative h-28 w-28">
				<svg viewBox="0 0 100 100" class="h-full w-full -rotate-90" aria-hidden="true">
					<circle cx="50" cy="50" r={r} fill="none" stroke-width="7" class="stroke-muted" />
					<circle
						cx="50"
						cy="50"
						r={r}
						fill="none"
						stroke-width="7"
						stroke-linecap="round"
						stroke-dasharray={`${circ}`}
						stroke-dashoffset={`${circ * (1 - frac())}`}
						class={`${ringStroke[phase()]} transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none`}
					/>
				</svg>
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<span
						role="timer"
						aria-label={`${phaseLabel[phase()]} time remaining`}
						class="font-mono text-xl font-semibold tabular-nums text-foreground"
					>
						{mmss()}
					</span>
					<span class="text-2xs uppercase tracking-wide text-muted-foreground">
						{phaseLabel[phase()]} · {round()}/{ROUNDS}
					</span>
				</div>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: generic dot group, not a form fieldset */}
			<div class="flex items-center gap-1.5" role="group" aria-label="Completed work rounds">
				<For each={Array.from({ length: ROUNDS })}>
					{(_, i) => (
						<span
							aria-hidden="true"
							class={`h-1.5 w-1.5 rounded-full ${i() < completed() ? "bg-primary" : "bg-muted"}`}
						/>
					)}
				</For>
				<span class="sr-only">
					{completed()} of {ROUNDS} work rounds completed
				</span>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
					onClick={() => setRunning((v) => !v)}
				>
					{running() ? "Pause" : "Start"}
				</button>
				<button
					type="button"
					class="h-8 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
					onClick={reset}
				>
					Reset
				</button>
			</div>
			<Show when={remaining() === 0 && !running()}>
				<span class="sr-only">Phase complete</span>
			</Show>
		</div>
	);
}
