import { type Accessor, createEffect, createSignal } from "solid-js";

/** Named dep value — an accessor is read (and tracked), anything else is taken as a static value. */
export type DepsDiffDeps = Record<string, Accessor<unknown> | unknown>;

export interface DepDiff {
	/** Name of the dep that changed */
	key: string;
	/** Value before the update */
	prev: unknown;
	/** Value after the update */
	next: unknown;
}

export interface DepsDiffControls {
	/** `{ key, prev, next }` entries for every dep that changed on the last update — `[]` when nothing moved */
	diff: Accessor<DepDiff[]>;
}

const read = (v: Accessor<unknown> | unknown) => (typeof v === "function" ? (v as Accessor<unknown>)() : v);

/**
 * Track per-dep prev/next values — every time a named dep changes, `diff`
 * becomes the list of `{ key, prev, next }` rows for that update (empty when
 * nothing changed). The initial run only snapshots; the first `diff` entries
 * appear on the first real change.
 *
 * @param deps — Record of named deps — accessors are tracked, raw values are compared as-is
 * @returns `{ diff }`
 *
 * @example
 * const d = useDepsDiff({ name, email });
 * <For each={d.diff()}>{(row) => <p>{row.key}: {String(row.prev)} → {String(row.next)}</p>}</For>
 */
export function useDepsDiff(deps: DepsDiffDeps): DepsDiffControls {
	const [diff, setDiff] = createSignal<DepDiff[]>([]);
	const prev = new Map<string, unknown>();

	createEffect(() => {
		const rows: DepDiff[] = [];
		for (const key of Object.keys(deps)) {
			const next = read(deps[key]);
			if (prev.has(key)) {
				const p = prev.get(key);
				if (!Object.is(p, next)) rows.push({ key, prev: p, next });
			}
			prev.set(key, next);
		}
		setDiff(rows);
	});

	return { diff };
}
