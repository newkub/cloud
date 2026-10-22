/**
 * Countdown — live countdown to a target date rendered as d/h/m/s tiles.
 */
import { createSignal, For, type JSX, onCleanup, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CountdownProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Target instant — Date, timestamp, or ISO string */
	to: Date | number | string;
	/** Render mode — "pill" is a compact "2d 4h" chip with urgency color @default "tiles" */
	variant?: "tiles" | "pill";
	/** Tile size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Hide the day tile @default false */
	hideDays?: boolean;
	/** Label prepended inside the pill (variant="pill") */
	pillLabel?: string;
	/** Text shown once the target has passed (variant="pill") @default "Ended" */
	endedText?: string;
	onComplete?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const tileSize = { sm: "h-10 w-9 text-sm", md: "h-12 w-11 text-base", lg: "h-14 w-13 text-lg" } as const;
const unitNames: Record<string, string> = { d: "days", h: "hours", m: "minutes", s: "seconds" };

function parts(to: number) {
	const diff = Math.max(0, to - Date.now());
	return [
		{ label: "d", value: Math.floor(diff / 86_400_000) },
		{ label: "h", value: Math.floor(diff / 3_600_000) % 24 },
		{ label: "m", value: Math.floor(diff / 60_000) % 60 },
		{ label: "s", value: Math.floor(diff / 1_000) % 60 },
	];
}

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MIN_MS = 60_000;

const fmtPill = (ms: number) => {
	if (ms <= 0) return "";
	const d = Math.floor(ms / DAY_MS);
	const h = Math.floor((ms % DAY_MS) / HOUR_MS);
	const m = Math.floor((ms % HOUR_MS) / MIN_MS);
	const s = Math.floor((ms % MIN_MS) / 1000);
	if (d > 0) return `${d}d ${h}h`;
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m ${s}s`;
};

export function Countdown(props: CountdownProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"to",
		"variant",
		"size",
		"hideDays",
		"pillLabel",
		"endedText",
		"onComplete",
		"radius",
		"elevation",
	]);
	const target = () => (local.to instanceof Date ? local.to.getTime() : new Date(local.to).getTime());
	const [now, setNow] = createSignal(Date.now());
	const timer = setInterval(() => {
		setNow(Date.now());
		if (target() - Date.now() <= 0) {
			clearInterval(timer);
			local.onComplete?.();
		}
	}, 1000);
	onCleanup(() => clearInterval(timer));
	const remaining = () => {
		now(); // subscribe to the tick
		return target() - Date.now();
	};
	const units = () => {
		now(); // subscribe to the tick
		return parts(target()).slice(local.hideDays ? 1 : 0);
	};

	if (local.variant === "pill") {
		const ended = () => remaining() <= 0;
		const urgent = () => !ended() && remaining() < DAY_MS;
		const cls = () =>
			ended()
				? "border-border bg-muted text-muted-foreground"
				: urgent()
					? "border-destructive/30 bg-destructive/10 text-destructive"
					: "border-primary/30 bg-primary/10 text-primary";
		return (
			<span
				role="timer"
				class={`solidui-countdown inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${cls()} ${local.class ?? ""}`.trim()}
			>
				<svg
					class="h-3 w-3"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 7v5l3 2" />
				</svg>
				{local.pillLabel ? <span class="font-medium">{local.pillLabel}</span> : null}
				<span>{ended() ? (local.endedText ?? "Ended") : fmtPill(remaining())}</span>
			</span>
		);
	}
	const a11yLabel = () =>
		units()
			.map((u) => `${u.value} ${unitNames[u.label]}`)
			.join(", ");
	return (
		<div
			class={`solidui-countdown flex items-end gap-1.5 ${local.class ?? ""}`.trim()}
			role="timer"
			aria-label={a11yLabel()}
			{...rest}
		>
			<For each={units()}>
				{(u) => (
					<div class="flex flex-col items-center gap-0.5">
						<span
							class={`flex items-center justify-center border border-border bg-surface font-mono font-bold tabular-nums ${tileSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
						>
							{String(u.value).padStart(2, "0")}
						</span>
						<span class="text-2xs uppercase text-muted-foreground">{u.label}</span>
					</div>
				)}
			</For>
		</div>
	);
}
