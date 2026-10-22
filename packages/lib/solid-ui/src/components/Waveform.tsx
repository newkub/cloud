/**
 * Waveform — bar waveform with played-portion fill and click/keyboard seek.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

const heightMap = { sm: "h-8", md: "h-12", lg: "h-16" } as const;
const playedMap = {
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	info: "bg-info",
} as const;

export interface WaveformProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSeek"> {
	/** Peak amplitudes 0–1 — one bar is rendered per entry. */
	peaks: number[];
	/** Played fraction 0–1 (controlled). Falls back to internal state when unset. */
	progress?: number;
	/** Called with the sought fraction 0–1 on click or arrow keys. */
	onSeek?: (ratio: number) => void;
	/** Waveform height. @default "md" */
	size?: keyof typeof heightMap;
	/** Fill color of the played portion. @default "primary" */
	variant?: keyof typeof playedMap;
	/** Keyboard step as a fraction of the whole clip. @default 0.05 */
	step?: number;
	/** aria-label for the slider role. @default "Seek" */
	seekLabel?: string;
	/** Corner radius of each bar. */
	barRadius?: Radius;
}

export function Waveform(props: WaveformProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"peaks",
		"progress",
		"onSeek",
		"size",
		"variant",
		"step",
		"seekLabel",
		"barRadius",
	]);
	const [internal, setInternal] = createSignal(0);
	const played = () => Math.min(1, Math.max(0, local.progress ?? internal()));
	const step = () => local.step ?? 0.05;
	let track: HTMLDivElement | undefined;

	const seek = (ratio: number) => {
		const next = Math.min(1, Math.max(0, ratio));
		if (local.progress === undefined) setInternal(next);
		local.onSeek?.(next);
	};

	const onClick = (e: MouseEvent) => {
		const rect = track?.getBoundingClientRect();
		if (!rect || rect.width === 0) return;
		seek((e.clientX - rect.left) / rect.width);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const next =
			e.key === "ArrowRight" || e.key === "ArrowUp"
				? played() + step()
				: e.key === "ArrowLeft" || e.key === "ArrowDown"
					? played() - step()
					: e.key === "Home"
						? 0
						: e.key === "End"
							? 1
							: undefined;
		if (next === undefined) return;
		e.preventDefault();
		seek(next);
	};

	return (
		<div
			ref={track}
			role="slider"
			tabIndex={0}
			aria-label={local.seekLabel ?? "Seek"}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(played() * 100)}
			class={`solidui-waveform flex cursor-pointer items-center gap-px rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${heightMap[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...rest}
		>
			<For each={local.peaks}>
				{(peak, i) => (
					<span
						aria-hidden="true"
						class={`flex-1 ${
							i() / Math.max(local.peaks.length, 1) < played()
								? playedMap[local.variant ?? "primary"]
								: "bg-muted-foreground/30"
						} ${radiusMap[local.barRadius ?? "full"]}`}
						style={{ height: `${Math.max(8, Math.round(Math.min(1, Math.max(0, peak)) * 100))}%` }}
					/>
				)}
			</For>
		</div>
	);
}
