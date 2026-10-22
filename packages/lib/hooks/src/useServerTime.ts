import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/** Numbers larger than a day are assumed to be epoch timestamps, not offsets. */
const DAY_MS = 86_400_000;

export interface ServerTimeState {
	/** Current server `Date` — ticks on `intervalMs`, corrected by the offset */
	now: Accessor<Date>;
	/** Resolved skew between server and local clock, in milliseconds */
	offset: Accessor<number>;
}

/**
 * Server-synchronised clock — same ticking behaviour as {@link useNow} but
 * shifted by the skew between the server's clock and the local one. Pass a
 * captured server instant (`Date` or epoch ms) and the offset is derived
 * from `Date.now()` at creation, or pass a small number to set the offset
 * directly. Numbers with `Math.abs(v) > 86_400_000` (24 h) are treated as
 * epoch timestamps; anything smaller is treated as a raw offset — real
 * clock skew beyond a day is vanishingly rare.
 * SSR-safe: captures the corrected value at creation, ticks after mount.
 *
 * @param source — Server `Date`, epoch timestamp, offset in ms, or accessor
 * @param options — `intervalMs` refresh rate. @default 1000
 * @returns `{ now, offset }` accessors
 *
 * @example
 * const server = useServerTime(response.headers.date, { intervalMs: 500 });
 * <p>{server.now().toISOString()}</p>
 */
export function useServerTime(
	source?: MaybeAccessor<Date | number | undefined>,
	options?: {
		/** Refresh rate in milliseconds. @default 1000 */
		intervalMs?: number;
	},
): ServerTimeState {
	const value = source === undefined ? undefined : read(source);
	const offsetMs =
		value instanceof Date
			? value.getTime() - Date.now()
			: typeof value === "number" && Math.abs(value) > DAY_MS
				? value - Date.now()
				: (value ?? 0);

	const [offset] = createSignal(offsetMs);
	const [now, setNow] = createSignal(new Date(Date.now() + offsetMs));

	onMount(() => {
		const id = setInterval(() => setNow(new Date(Date.now() + offset())), options?.intervalMs ?? 1000);
		onCleanup(() => clearInterval(id));
	});

	return { now, offset };
}
