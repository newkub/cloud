import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface RelativeTimeOptions {
	/** BCP-47 locale(s) for `Intl.RelativeTimeFormat` */
	locale?: MaybeAccessor<string | string[] | undefined>;
	/** Tick rate for reformatting; `0` disables ticking. @default 60_000 */
	intervalMs?: number;
	/** `Intl.RelativeTimeFormat` `numeric` option. @default "auto" */
	numeric?: "always" | "auto";
	/** `Intl.RelativeTimeFormat` `style` option. @default "long" */
	style?: "long" | "short" | "narrow";
}

const UNIT_MS: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 31_536_000_000],
	["month", 2_592_000_000],
	["week", 604_800_000],
	["day", 86_400_000],
	["hour", 3_600_000],
	["minute", 60_000],
	["second", 1_000],
];

/**
 * Live relative-time label — formats `instant` against the current time
 * with `Intl.RelativeTimeFormat`, re-ticking every `intervalMs`. Picks the
 * largest unit whose magnitude is ≥ 1 (seconds, minutes, hours, …).
 *
 * @param instant — `Date` or epoch ms, accessor accepted
 * @param options — `locale`, `intervalMs`, `numeric`, `style`
 * @returns Accessor yielding strings like `"2 hours ago"` / `"in 3 days"`
 *
 * @example
 * const label = useRelativeTime(() => comment.createdAt, { intervalMs: 30_000 });
 * <time>{label()}</time>
 */
export function useRelativeTime(
	instant: MaybeAccessor<Date | number>,
	options?: RelativeTimeOptions,
): Accessor<string> {
	const [now, setNow] = createSignal(Date.now());

	onMount(() => {
		const ms = options?.intervalMs ?? 60_000;
		if (ms <= 0) return;
		const id = setInterval(() => setNow(Date.now()), ms);
		onCleanup(() => clearInterval(id));
	});

	return createMemo(() => {
		const target = read(instant);
		const ms = (target instanceof Date ? target.getTime() : target) - now();
		if (!Number.isFinite(ms)) return "";
		const rtf = new Intl.RelativeTimeFormat(read(options?.locale), {
			numeric: options?.numeric ?? "auto",
			style: options?.style ?? "long",
		});
		const abs = Math.abs(ms);
		for (const [unit, unitMs] of UNIT_MS) {
			if (abs >= unitMs || unit === "second") return rtf.format(Math.round(ms / unitMs), unit);
		}
		return rtf.format(0, "second");
	});
}
