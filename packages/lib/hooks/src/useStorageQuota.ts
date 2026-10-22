import { type Accessor, createMemo, createSignal, onMount } from "solid-js";

export interface StorageQuotaState {
	/** Bytes used by the origin — `undefined` until `refresh()` resolves */
	usage: Accessor<number | undefined>;
	/** Total bytes the origin may use — `undefined` until `refresh()` resolves */
	quota: Accessor<number | undefined>;
	/** `usage / quota * 100` — `undefined` until both values are known */
	percent: Accessor<number | undefined>;
	/** Whether `navigator.storage.estimate` exists */
	supported: boolean;
	/** Re-query the estimate — also runs once on mount */
	refresh: () => Promise<void>;
}

/**
 * Reactive `navigator.storage.estimate()` — origin storage `usage`/`quota` in
 * bytes plus a derived `percent`. `supported` is a static flag; when the API is
 * missing the accessors stay `undefined` and `refresh()` resolves immediately.
 *
 * @returns `{ usage, quota, percent, supported, refresh }`
 *
 * @example
 * const q = useStorageQuota();
 * <Show when={q.percent()}>{(p) => <p>{p().toFixed(1)}% of quota used</p>}</Show>
 */
export function useStorageQuota(): StorageQuotaState {
	const [usage, setUsage] = createSignal<number>();
	const [quota, setQuota] = createSignal<number>();
	const percent = createMemo(() => {
		const u = usage();
		const q = quota();
		return u !== undefined && q ? (u / q) * 100 : undefined;
	});
	const supported = typeof navigator !== "undefined" && typeof navigator.storage?.estimate === "function";

	const refresh = async (): Promise<void> => {
		if (!supported) return;
		try {
			const est = await navigator.storage.estimate();
			setUsage(est.usage);
			setQuota(est.quota);
		} catch {
			// estimate() can reject on some platforms — keep previous values
		}
	};

	onMount(() => void refresh());

	return { usage, quota, percent, supported, refresh };
}
