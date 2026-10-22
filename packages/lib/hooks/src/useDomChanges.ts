import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface DomChangeSummary {
	/** Cumulative nodes added under the target */
	added: number;
	/** Cumulative nodes removed under the target */
	removed: number;
	/** Cumulative mutation records observed */
	mutations: number;
}

const INITIAL: DomChangeSummary = { added: 0, removed: 0, mutations: 0 };

/**
 * Summarise DOM churn under an element — counts added/removed nodes and total
 * mutation records, flushed on a throttle so rapid edits don't spam updates.
 * Re-observes when `target()` resolves to a different element.
 *
 * @param target — Accessor for the element to watch
 * @param options — `throttle` ms between summary flushes. @default 100
 * @returns Accessor for `{ added, removed, mutations }` counters
 *
 * @example
 * const changes = useDomChanges(() => list);
 * <p>{changes().added} added / {changes().removed} removed</p>
 */
export function useDomChanges(
	target: Accessor<Element | undefined>,
	options?: { throttle?: number },
): Accessor<DomChangeSummary> {
	const [summary, setSummary] = createSignal<DomChangeSummary>(INITIAL);
	const throttle = options?.throttle ?? 100;

	createEffect(() => {
		const el = target();
		if (!el || typeof MutationObserver === "undefined") return;
		let pending = { ...INITIAL };
		let timer: ReturnType<typeof setTimeout> | undefined;

		const flush = () => {
			timer = undefined;
			const batch = pending;
			pending = { ...INITIAL };
			setSummary((s) => ({
				added: s.added + batch.added,
				removed: s.removed + batch.removed,
				mutations: s.mutations + batch.mutations,
			}));
		};

		const mo = new MutationObserver((records) => {
			for (const r of records) {
				pending.mutations += 1;
				pending.added += r.addedNodes.length;
				pending.removed += r.removedNodes.length;
			}
			if (timer === undefined) timer = setTimeout(flush, throttle);
		});
		mo.observe(el, { attributes: true, characterData: true, childList: true, subtree: true });
		onCleanup(() => {
			mo.disconnect();
			clearTimeout(timer);
		});
	});

	return summary;
}
