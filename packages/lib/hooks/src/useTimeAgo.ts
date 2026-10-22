import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const MONTH = 2_630_000_000;
const YEAR = 31_560_000_000;

const unit = (abs: number): string => {
	if (abs < 90_000) return "1m";
	if (abs < 45 * MINUTE) return `${Math.round(abs / MINUTE)}m`;
	if (abs < 90 * MINUTE) return "1h";
	if (abs < 22 * HOUR) return `${Math.round(abs / HOUR)}h`;
	if (abs < 36 * HOUR) return "1d";
	if (abs < 25 * DAY) return `${Math.round(abs / DAY)}d`;
	if (abs < 45 * DAY) return "1mo";
	if (abs < 345 * DAY) return `${Math.round(abs / MONTH)}mo`;
	if (abs < 545 * DAY) return "1y";
	return `${Math.round(abs / YEAR)}y`;
};

/**
 * Human "time ago" label for a reactive timestamp — `"just now"`,
 * `"2m ago"`, `"3h ago"`, `"5d ago"`. Re-evaluates every 30 seconds so
 * labels stay fresh; future dates render as `"in 2m"`.
 *
 * @param input — Accessor returning a `Date` or epoch ms
 * @returns Accessor for the relative label
 *
 * @example
 * const ago = useTimeAgo(() => post().createdAt);
 * <span>{ago()}</span>
 */
export function useTimeAgo(input: Accessor<Date | number>): Accessor<string> {
	const [tick, setTick] = createSignal(0);

	onMount(() => {
		const id = setInterval(() => setTick((t) => t + 1), 30_000);
		onCleanup(() => clearInterval(id));
	});

	return createMemo(() => {
		tick();
		const v = input();
		const ts = v instanceof Date ? v.getTime() : v;
		const diff = Date.now() - ts;
		if (Math.abs(diff) < 45_000) return "just now";
		const label = unit(Math.abs(diff));
		return diff >= 0 ? `${label} ago` : `in ${label}`;
	});
}
