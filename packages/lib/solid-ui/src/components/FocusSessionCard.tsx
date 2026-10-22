/**
 * FocusSessionCard - focus timer card with progress ring, start/pause control and a distractions counter.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface FocusSessionCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onToggle"> {
	/** Session goal text. */
	goal: string;
	/** Planned session length in minutes. @default 25 */
	minutes?: number;
	/** Controlled running state — omit for an internal timer. */
	running?: boolean;
	/** Called whenever running would toggle. */
	onToggle?: (running: boolean) => void;
	/** Called with the new count when a distraction is logged. */
	onDistraction?: (count: number) => void;
	/** Called once when the timer reaches zero. */
	onComplete?: () => void;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function FocusSessionCard(props: FocusSessionCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-focus-session-card flex flex-col items-center gap-3 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["goal", "minutes", "running", "onToggle", "onDistraction", "onComplete"]);

	const total = () => Math.max(0, (local.minutes ?? 25) * 60);
	const [remaining, setRemaining] = createSignal(total());
	const [internalRunning, setInternalRunning] = createSignal(local.running ?? false);
	const running = () => local.running ?? internalRunning();
	const [distractions, setDistractions] = createSignal(0);
	let completed = false;

	const toggle = () => {
		const next = !running();
		if (local.running === undefined) setInternalRunning(next);
		local.onToggle?.(next);
	};

	const logDistraction = () => {
		const count = distractions() + 1;
		setDistractions(count);
		local.onDistraction?.(count);
	};

	onMount(() => {
		const timer = setInterval(() => {
			if (!running()) return;
			setRemaining((s) => {
				if (s <= 1) {
					if (!completed) {
						completed = true;
						queueMicrotask(() => {
							setInternalRunning(false);
							local.onComplete?.();
						});
					}
					return 0;
				}
				return s - 1;
			});
		}, 1000);
		onCleanup(() => clearInterval(timer));
	});

	const frac = () => (total() > 0 ? remaining() / total() : 0);
	const mmss = () => {
		const s = remaining();
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
	};
	const r = 45;
	const circ = 2 * Math.PI * r;

	return (
		<div class={className()} {...rest}>
			<div class="self-stretch text-center text-sm font-semibold text-foreground">{local.goal}</div>
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
						class="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
					/>
				</svg>
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<span
						role="timer"
						aria-label="Focus time remaining"
						class="font-mono text-xl font-semibold tabular-nums text-foreground"
					>
						{mmss()}
					</span>
					<span class="text-2xs uppercase tracking-wide text-muted-foreground">
						{running() ? "Focusing" : remaining() === 0 ? "Done" : "Paused"}
					</span>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
					onClick={toggle}
					disabled={remaining() === 0}
				>
					{running() ? "Pause" : "Start"}
				</button>
				<button
					type="button"
					class="h-8 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
					onClick={logDistraction}
				>
					Log distraction
					<Show when={distractions() > 0}>
						<span class="ml-1.5 rounded-full bg-warning/15 px-1.5 py-0.5 text-2xs font-semibold text-warning">
							{distractions()}
						</span>
					</Show>
				</button>
			</div>
			<span class="sr-only" role="status">
				{distractions()} distractions logged
			</span>
		</div>
	);
}
