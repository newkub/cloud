/**
 * EventCountdown — event card with date block, d/h/m/s countdown tiles and an RSVP button.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";

export interface EventCountdownEvent {
	/** Event title */
	title: string;
	/** Event start — Date or epoch ms */
	date: Date | number;
	/** Optional venue/location line */
	location?: string;
}

export interface EventCountdownProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Event details */
	event?: EventCountdownEvent;
	/** Called when the RSVP button is clicked */
	onRsvp?: () => void;
	/** Update interval in ms @default 1000 */
	interval?: number;
}

const MIN_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function EventCountdown(props: EventCountdownProps) {
	const [local, rest] = splitProps(props, ["class", "event", "onRsvp", "interval"]);
	const dateMs = () => (local.event?.date instanceof Date ? local.event.date.getTime() : (local.event?.date ?? 0));
	const [remaining, setRemaining] = createSignal(dateMs() - Date.now());
	const [attending, setAttending] = createSignal(false);
	onMount(() => {
		const timer = setInterval(() => setRemaining(dateMs() - Date.now()), local.interval ?? 1000);
		onCleanup(() => clearInterval(timer));
	});

	const started = () => remaining() <= 0;
	const tiles = () => {
		const ms = Math.max(0, remaining());
		return [
			{ value: Math.floor(ms / DAY_MS), label: "days" },
			{ value: Math.floor((ms % DAY_MS) / HOUR_MS), label: "hrs" },
			{ value: Math.floor((ms % HOUR_MS) / MIN_MS), label: "min" },
			{ value: Math.floor((ms % MIN_MS) / 1000), label: "sec" },
		];
	};
	const dateBlock = () => {
		const d = new Date(dateMs());
		return {
			month: d.toLocaleDateString("en-US", { month: "short" }),
			day: d.getDate(),
			weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
		};
	};
	const rsvp = () => {
		setAttending((v) => !v);
		local.onRsvp?.();
	};

	return (
		<div
			class={`solidui-event-countdown w-64 rounded-lg border border-border bg-surface p-4 shadow-sm ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start gap-3">
				<div class="flex w-12 shrink-0 flex-col items-center rounded-md border border-border bg-muted py-1.5">
					<span class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">{dateBlock().month}</span>
					<span class="text-lg font-bold leading-tight tabular-nums text-foreground">{dateBlock().day}</span>
					<span class="text-2xs text-muted-foreground">{dateBlock().weekday}</span>
				</div>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold text-foreground">{local.event?.title}</p>
					<Show when={local.event?.location}>
						<p class="mt-0.5 truncate text-2xs text-muted-foreground">{local.event?.location}</p>
					</Show>
				</div>
			</div>
			<div class="mt-3 grid grid-cols-4 gap-1.5" role="timer" aria-label="Time until event">
				<For each={tiles()}>
					{(tile) => (
						<div class="flex flex-col items-center rounded-md bg-muted py-1.5">
							<span class="font-mono text-sm font-bold tabular-nums text-foreground">
								{String(tile.value).padStart(2, "0")}
							</span>
							<span class="text-2xs uppercase tracking-wide text-muted-foreground">{tile.label}</span>
						</div>
					)}
				</For>
			</div>
			<button
				type="button"
				class={`mt-3 h-8 w-full rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
					attending()
						? "border border-success/30 bg-success/10 text-success"
						: "bg-primary text-primary-foreground hover:bg-primary/90"
				}`}
				aria-pressed={attending()}
				onClick={rsvp}
			>
				{started() ? "Event started" : attending() ? "Attending ✓" : "RSVP"}
			</button>
		</div>
	);
}
