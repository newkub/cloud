/**
 * CountdownRing — circular SVG countdown timer with progress ring.
 */
import { createEffect, createSignal, type JSX, onCleanup, Show, splitProps } from "solid-js";

export interface CountdownRingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Total seconds. */
	seconds: number;
	/** Start counting on mount. @default true */
	autoStart?: boolean;
	/** Called each tick with remaining seconds. */
	onTick?: (remaining: number) => void;
	onComplete?: () => void;
	/** Pause control — external driven. */
	paused?: boolean;
	size?: "sm" | "md" | "lg" | number;
	/** Ring color — status palette. */
	variant?: "default" | "success" | "warning" | "destructive" | "info";
	/** Show MM:SS text in the middle. @default true */
	showText?: boolean;
	/** Text under the ring. */
	label?: string;
}

const px = { sm: 48, md: 72, lg: 96 } as const;
const strokeColor: Record<string, string> = {
	default: "stroke-primary",
	success: "stroke-success",
	warning: "stroke-warning",
	destructive: "stroke-destructive",
	info: "stroke-info",
};

export function CountdownRing(props: CountdownRingProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"seconds",
		"autoStart",
		"onTick",
		"onComplete",
		"paused",
		"size",
		"variant",
		"showText",
		"label",
	]);
	const [remaining, setRemaining] = createSignal(local.seconds);
	let timer: ReturnType<typeof setInterval> | undefined;
	createEffect(() => {
		clearInterval(timer);
		setRemaining(local.seconds);
		if ((local.autoStart ?? true) && !local.paused) {
			timer = setInterval(() => {
				setRemaining((s) => {
					if (s <= 1) {
						clearInterval(timer);
						local.onComplete?.();
						return 0;
					}
					const next = s - 1;
					local.onTick?.(next);
					return next;
				});
			}, 1000);
		}
	});
	onCleanup(() => clearInterval(timer));

	const dim = () => (typeof local.size === "number" ? local.size : px[local.size ?? "md"]);
	const frac = () => (local.seconds > 0 ? remaining() / local.seconds : 0);
	const mmss = () => {
		const s = remaining();
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
	};
	const r = 45;
	const circ = 2 * Math.PI * r;

	return (
		<div
			role="timer"
			class={`solidui-countdown-ring inline-flex flex-col items-center gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative" style={{ width: `${dim()}px`, height: `${dim()}px` }}>
				<svg viewBox="0 0 100 100" class="h-full w-full -rotate-90" aria-hidden="true">
					<circle cx="50" cy="50" r={r} fill="none" stroke-width="6" class="stroke-muted" />
					<circle
						cx="50"
						cy="50"
						r={r}
						fill="none"
						stroke-width="6"
						stroke-linecap="round"
						stroke-dasharray={`${circ}`}
						stroke-dashoffset={`${circ * (1 - frac())}`}
						class={`${strokeColor[local.variant ?? "default"]} transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none`}
					/>
				</svg>
				<Show when={local.showText ?? true}>
					<span class="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums text-foreground">
						{mmss()}
					</span>
				</Show>
			</div>
			<Show when={local.label}>
				<span class="text-2xs text-muted-foreground">{local.label}</span>
			</Show>
		</div>
	);
}
