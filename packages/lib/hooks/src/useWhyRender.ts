import { type Accessor, createEffect, createSignal } from "solid-js";

/** Named dep value — an accessor is read (and tracked), anything else is taken as a static value. */
export type WhyRenderDeps = Record<string, Accessor<unknown> | unknown>;

export interface WhyRenderOptions {
	/** Label printed above the `console.table` diff — e.g. the component name */
	name?: string;
}

export interface WhyRenderControls {
	/** Names of the deps that changed on the most recent update */
	changes: Accessor<string[]>;
}

const read = (v: Accessor<unknown> | unknown) => (typeof v === "function" ? (v as Accessor<unknown>)() : v);

/**
 * Debug hook — every time the named deps change it logs a `console.table` of
 * `{ dep, prev, next }` rows (prefixed by `options.name` when given) and
 * exposes `changes`, the list of dep names that moved on the last update.
 * The initial run only snapshots; nothing is logged until a dep changes.
 *
 * @param deps — Record of named deps — accessors are tracked, raw values are compared as-is
 * @param options — `name` labels the log output
 * @returns `{ changes }`
 *
 * @example
 * const why = useWhyRender({ count, query }, { name: "SearchBox" });
 * <p>changed: {why.changes().join(", ")}</p>
 */
export function useWhyRender(deps: WhyRenderDeps, options?: WhyRenderOptions): WhyRenderControls {
	const [changes, setChanges] = createSignal<string[]>([]);
	const prev = new Map<string, unknown>();

	createEffect(() => {
		const rows: { dep: string; prev: unknown; next: unknown }[] = [];
		for (const key of Object.keys(deps)) {
			const next = read(deps[key]);
			if (prev.has(key)) {
				const p = prev.get(key);
				if (!Object.is(p, next)) rows.push({ dep: key, prev: p, next });
			}
			prev.set(key, next);
		}
		setChanges(rows.map((r) => r.dep));
		if (rows.length && typeof console !== "undefined") {
			if (options?.name) console.debug(`[useWhyRender] ${options.name} updated`);
			console.table(rows);
		}
	});

	return { changes };
}
