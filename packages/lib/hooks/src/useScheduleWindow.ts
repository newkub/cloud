import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export interface ScheduleWindowOptions {
	/** Window start as `"HH:mm"` (24 h, inclusive). */
	start: string;
	/** Window end as `"HH:mm"` (exclusive). `end < start` wraps past midnight. */
	end: string;
	/** Weekdays the window may *start* on — `0` Sunday … `6` Saturday. @default all */
	days?: readonly number[];
	/** IANA time zone to evaluate the wall clock in. @default local zone */
	tz?: string;
	/** Refresh rate in milliseconds. @default 60_000 */
	intervalMs?: number;
}

export interface ScheduleWindowState {
	/** True while the current instant falls inside the window */
	active: Accessor<boolean>;
	/** Next `Date` at which `active` flips — `null` if none within ~8 days */
	nextChange: Accessor<Date | null>;
}

const DAY_MS = 86_400_000;
const MIN_MS = 60_000;
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const parseHHmm = (value: string, label: string): number => {
	const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
	if (!m)
		throw new RangeError(`useScheduleWindow: ${label} must be "HH:mm" (00:00–23:59), got ${JSON.stringify(value)}`);
	return Number(m[1]) * 60 + Number(m[2]);
};

interface ZonedParts {
	year: number;
	month: number;
	day: number;
	weekday: number;
	minuteOfDay: number;
	second: number;
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const formatters = new Map<string, Intl.DateTimeFormat>();
const formatterFor = (tz: string) => {
	let f = formatters.get(tz);
	if (!f) {
		f = new Intl.DateTimeFormat("en-US", {
			timeZone: tz,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hourCycle: "h23",
		});
		formatters.set(tz, f);
	}
	return f;
};

/** Wall-clock parts of `instant` expressed in `tz`. */
const zonedParts = (instant: number, tz: string): ZonedParts => {
	const out: Record<string, number> = {};
	for (const p of formatterFor(tz).formatToParts(new Date(instant))) {
		if (p.type === "weekday") out.weekday = WEEKDAYS[p.value] ?? 0;
		else if (p.type !== "literal") out[p.type] = Number(p.value);
	}
	return {
		year: out.year ?? 1970,
		month: out.month ?? 1,
		day: out.day ?? 1,
		weekday: out.weekday ?? 0,
		minuteOfDay: (out.hour ?? 0) * 60 + (out.minute ?? 0),
		second: out.second ?? 0,
	};
};

const localParts = (instant: number): ZonedParts => {
	const d = new Date(instant);
	return {
		year: d.getFullYear(),
		month: d.getMonth() + 1,
		day: d.getDate(),
		weekday: d.getDay(),
		minuteOfDay: d.getHours() * 60 + d.getMinutes(),
		second: d.getSeconds(),
	};
};

/** Offset (wall − UTC) of `tz` at `utcMs`, via round-tripped parts. */
const tzOffsetMs = (utcMs: number, tz: string): number => {
	const p = zonedParts(utcMs, tz);
	const wall = Date.UTC(p.year, p.month - 1, p.day, Math.floor(p.minuteOfDay / 60), p.minuteOfDay % 60, p.second);
	return wall - Math.floor(utcMs / 1000) * 1000;
};

/** Convert a wall-clock pseudo-UTC timestamp in `tz` into a real UTC instant. */
const zonedWallToUtc = (wallMs: number, tz: string): number => {
	let utc = wallMs;
	for (let i = 0; i < 4; i++) {
		const next = wallMs - tzOffsetMs(utc, tz);
		if (next === utc) break;
		utc = next;
	}
	return utc;
};

/**
 * Scheduled-window gate — `active()` is true while the wall clock sits inside
 * the `start`–`end` window on an allowed `days` entry, re-evaluated every
 * `intervalMs`. `nextChange()` reports the upcoming flip instant. Windows
 * where `end < start` wrap past midnight, with the post-midnight stretch
 * counting toward the previous day. Equal `start`/`end` means "all day".
 * Pass `tz` to evaluate in another zone — DST-safe via `Intl`.
 * SSR-safe: initial state is computed at creation; ticking starts on mount.
 *
 * @param options — `start`, `end`, `days`, `tz`, `intervalMs`
 * @returns `{ active, nextChange }` accessors
 *
 * @example
 * const biz = useScheduleWindow({ start: "09:00", end: "17:00", days: [1,2,3,4,5] });
 * <Show when={biz.active()} fallback={<p>Opens {biz.nextChange()?.toLocaleString()}</p>}>
 *   <p>We are open</p>
 * </Show>
 */
export function useScheduleWindow(options: ScheduleWindowOptions): ScheduleWindowState {
	const startMin = parseHHmm(options.start, "start");
	const endMin = parseHHmm(options.end, "end");
	const days = new Set(options.days ?? ALL_DAYS);
	const tz = options.tz;
	const wrap = startMin > endMin;
	const parts = (instant: number) => (tz ? zonedParts(instant, tz) : localParts(instant));

	const isActiveAt = (instant: number): boolean => {
		if (!days.size) return false;
		const { weekday, minuteOfDay } = parts(instant);
		if (startMin === endMin) return days.has(weekday);
		if (!wrap) return days.has(weekday) && minuteOfDay >= startMin && minuteOfDay < endMin;
		return (minuteOfDay >= startMin && days.has(weekday)) || (minuteOfDay < endMin && days.has((weekday + 6) % 7));
	};

	/** Millis of `minuteOfDay` on the zoned calendar date `daysAhead` from `ref`. */
	const boundaryAt = (ref: number, daysAhead: number, minuteOfDay: number): number => {
		const p = parts(ref);
		if (!tz) {
			const d = new Date(ref);
			d.setHours(0, 0, 0, 0);
			return d.getTime() + daysAhead * DAY_MS + minuteOfDay * MIN_MS;
		}
		const wall = Date.UTC(p.year, p.month - 1, p.day + daysAhead, 0, 0, 0) + minuteOfDay * MIN_MS;
		return zonedWallToUtc(wall, tz);
	};

	const nextChangeAt = (instant: number): Date | null => {
		if (!days.size) return null;
		const current = isActiveAt(instant);
		const candidates: number[] = [];
		for (let i = 0; i <= 8; i++) {
			const probe = parts(boundaryAt(instant, i, 0));
			if (!days.has(probe.weekday)) continue;
			candidates.push(boundaryAt(instant, i, startMin));
			candidates.push(boundaryAt(instant, i, endMin) + (wrap ? DAY_MS : 0));
		}
		candidates.sort((a, b) => a - b);
		for (const t of candidates) {
			if (t > instant && isActiveAt(t) !== current) return new Date(t);
		}
		return null;
	};

	const [now, setNow] = createSignal(Date.now());
	onMount(() => {
		const id = setInterval(() => setNow(Date.now()), options.intervalMs ?? 60_000);
		onCleanup(() => clearInterval(id));
	});

	return {
		active: createMemo(() => isActiveAt(now())),
		nextChange: createMemo(() => nextChangeAt(now())),
	};
}
