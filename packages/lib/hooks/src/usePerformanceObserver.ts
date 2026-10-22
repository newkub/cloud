import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PerformanceObserverOptions {
	/** Include entries recorded before the observer started. @default true */
	buffered?: boolean;
	/** Cap the buffered list (oldest entries drop off). @default 500 */
	max?: number;
}

/**
 * Buffer PerformanceEntry records (navigation, resource, paint, longtask, …)
 * into a signal. `types` defaults to every entry type the browser supports —
 * unsupported names are filtered out so the observer never throws.
 *
 * @param types — Entry types to observe. @default `PerformanceObserver.supportedEntryTypes`
 * @param options — `buffered` replays past entries; `max` caps the list
 * @returns Accessor for the accumulated entries
 *
 * @example
 * const entries = usePerformanceObserver(["resource", "navigation"]);
 * <p>{entries().length} perf entries</p>
 */
export function usePerformanceObserver(
	types?: readonly string[],
	options?: PerformanceObserverOptions,
): Accessor<PerformanceEntry[]> {
	const [entries, setEntries] = createSignal<PerformanceEntry[]>([]);
	const max = options?.max ?? 500;

	onMount(() => {
		if (typeof PerformanceObserver === "undefined") return;
		const supported: readonly string[] = PerformanceObserver.supportedEntryTypes ?? [];
		const entryTypes = (types ?? supported).filter((t) => supported.includes(t));
		if (!entryTypes.length) return;
		const po = new PerformanceObserver((list) => {
			const fresh = list.getEntries();
			setEntries((prev) => {
				const next = [...prev, ...fresh];
				return next.length > max ? next.slice(next.length - max) : next;
			});
		});
		try {
			po.observe({ type: entryTypes[0], buffered: options?.buffered ?? true });
			for (const t of entryTypes.slice(1)) po.observe({ type: t, buffered: options?.buffered ?? true });
		} catch {
			// Older engines require entryTypes — retry without `buffered`.
			try {
				po.observe({ entryTypes });
			} catch {
				po.disconnect();
				return;
			}
		}
		onCleanup(() => po.disconnect());
	});

	return entries;
}
