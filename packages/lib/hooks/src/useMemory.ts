import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MemoryInfo {
	/** Bytes currently on the JS heap */
	usedJSHeapSize: number;
	/** Bytes allocated for the JS heap */
	totalJSHeapSize: number;
	/** Heap size cap (performance.memory.jsHeapSizeLimit) */
	limit: number;
}

interface PerformanceMemory {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
}

/**
 * `performance.memory` sampler (Chromium-only) — polls the JS heap on an
 * interval. Stays `null` where the API is missing; never throws.
 *
 * @param interval — Polling period in milliseconds. @default 2000
 * @returns Accessor for `MemoryInfo | null`
 *
 * @example
 * const memory = useMemory(1000);
 * <Show when={memory()}>{(m) => <span>{(m().usedJSHeapSize / 1e6).toFixed(1)} MB</span>}</Show>
 */
export function useMemory(interval = 2000): Accessor<MemoryInfo | null> {
	const [memory, setMemory] = createSignal<MemoryInfo | null>(null);

	onMount(() => {
		const perf = performance as { memory?: PerformanceMemory };
		if (!perf.memory) return;
		const read = () => {
			const m = perf.memory;
			if (m)
				setMemory({ usedJSHeapSize: m.usedJSHeapSize, totalJSHeapSize: m.totalJSHeapSize, limit: m.jsHeapSizeLimit });
		};
		read();
		const id = setInterval(read, interval);
		onCleanup(() => clearInterval(id));
	});

	return memory;
}
