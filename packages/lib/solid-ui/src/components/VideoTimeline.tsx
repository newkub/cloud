/**
 * VideoTimeline — seekbar with buffered track, chapter tick marks and a hover time tooltip.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";

/** A labelled point on the timeline. */
export interface VideoChapter {
	/** Seconds from the start. */
	time: number;
	label: string;
}

const fmt = (s: number) => {
	const t = Math.max(0, Math.floor(s));
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const sec = String(t % 60).padStart(2, "0");
	return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

export interface VideoTimelineProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSeek"> {
	/** Total duration in seconds. */
	duration: number;
	/** Playhead position in seconds (controlled). Falls back to internal state when unset. */
	current?: number;
	/** Buffered up to this many seconds. */
	buffered?: number;
	/** Chapter tick marks with labels. */
	chapters?: VideoChapter[];
	/** Called with the sought position in seconds. */
	onSeek?: (seconds: number) => void;
	/** Seconds jumped per arrow key press. @default 5 */
	step?: number;
	/** Show current/total time under the track. @default true */
	showTimes?: boolean;
	/** aria-label for the slider role. @default "Seek video" */
	seekLabel?: string;
}

export function VideoTimeline(props: VideoTimelineProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"duration",
		"current",
		"buffered",
		"chapters",
		"onSeek",
		"step",
		"showTimes",
		"seekLabel",
	]);
	const [internal, setInternal] = createSignal(0);
	const [hover, setHover] = createSignal<{ x: number; t: number } | null>(null);
	let track: HTMLDivElement | undefined;

	const duration = () => Math.max(local.duration, 0.001);
	const current = () => Math.min(duration(), Math.max(0, local.current ?? internal()));
	const pct = (t: number) => (Math.min(duration(), Math.max(0, t)) / duration()) * 100;
	const step = () => local.step ?? 5;

	const seek = (t: number) => {
		const next = Math.min(duration(), Math.max(0, t));
		if (local.current === undefined) setInternal(next);
		local.onSeek?.(next);
	};

	const ratioAt = (clientX: number) => {
		const rect = track?.getBoundingClientRect();
		if (!rect || rect.width === 0) return 0;
		return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
	};

	const onClick = (e: MouseEvent) => seek(ratioAt(e.clientX) * duration());
	const onMouseMove = (e: MouseEvent) => {
		const x = ratioAt(e.clientX);
		setHover({ x, t: x * duration() });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const next =
			e.key === "ArrowRight" || e.key === "ArrowUp"
				? current() + step()
				: e.key === "ArrowLeft" || e.key === "ArrowDown"
					? current() - step()
					: e.key === "PageUp"
						? current() + duration() / 10
						: e.key === "PageDown"
							? current() - duration() / 10
							: e.key === "Home"
								? 0
								: e.key === "End"
									? duration()
									: undefined;
		if (next === undefined) return;
		e.preventDefault();
		seek(next);
	};

	const hoverChapter = () => {
		const t = hover()?.t;
		if (t === undefined) return undefined;
		return local.chapters?.filter((c) => c.time <= t).at(-1);
	};

	return (
		<div class={`solidui-video-timeline w-full select-none ${local.class ?? ""}`.trim()} {...rest}>
			<div
				ref={track}
				role="slider"
				tabIndex={0}
				aria-label={local.seekLabel ?? "Seek video"}
				aria-valuemin={0}
				aria-valuemax={Math.round(duration())}
				aria-valuenow={Math.round(current())}
				aria-valuetext={`${fmt(current())} of ${fmt(duration())}`}
				class="group relative h-4 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onClick={onClick}
				onKeyDown={onKeyDown}
				onMouseMove={onMouseMove}
				onMouseLeave={() => setHover(null)}
			>
				<div class="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
					<Show when={local.buffered !== undefined}>
						<div
							class="absolute inset-y-0 left-0 bg-muted-foreground/30"
							style={{ width: `${pct(local.buffered ?? 0)}%` }}
						/>
					</Show>
					<div class="absolute inset-y-0 left-0 bg-primary" style={{ width: `${pct(current())}%` }} />
				</div>
				<For each={local.chapters}>
					{(chapter) => (
						<span
							title={chapter.label}
							class="absolute top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
							style={{ left: `${pct(chapter.time)}%` }}
						/>
					)}
				</For>
				<span
					class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow ring-2 ring-background transition-transform group-hover:scale-110"
					style={{ left: `${pct(current())}%` }}
				/>
				<Show when={hover()}>
					{(h) => (
						<span
							class="pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-2xs whitespace-nowrap text-foreground shadow-sm"
							style={{ left: `${h().x * 100}%` }}
						>
							{fmt(h().t)}
							<Show when={hoverChapter()}>{(c) => <span class="text-muted-foreground"> · {c().label}</span>}</Show>
						</span>
					)}
				</Show>
			</div>
			<Show when={local.showTimes ?? true}>
				<div class="mt-1 flex justify-between text-2xs tabular-nums text-muted-foreground">
					<span>{fmt(current())}</span>
					<span>{fmt(duration())}</span>
				</div>
			</Show>
		</div>
	);
}
