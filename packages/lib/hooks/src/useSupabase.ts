import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/** Minimal structural shape of a Supabase client's `from()` chain. */
export interface SupabaseLike {
	from: (table: string) => {
		select: (
			columns?: string,
		) => PromiseLike<{ data: unknown; error: unknown }> | Promise<{ data: unknown; error: unknown }>;
	};
}

export type SupabaseStatus = "idle" | "loading" | "success" | "error";

export interface SupabaseQueryState<T> {
	rows: Accessor<T[] | undefined>;
	error: Accessor<Error | undefined>;
	loading: Accessor<boolean>;
	/** True when a client was provided — queries are skipped otherwise */
	isConfigured: Accessor<boolean>;
	/** Outcome of the latest query */
	status: Accessor<SupabaseStatus>;
	refetch: () => void;
}

/** Normalize Supabase/PostgREST error objects (`{ message }`) and thrown values to Error. */
const toError = (e: unknown): Error => {
	if (e instanceof Error) return e;
	if (typeof e === "object" && e !== null && "message" in e)
		return new Error(String((e as { message: unknown }).message));
	return new Error(String(e));
};

/**
 * Query a Supabase table reactively — pass any SupabaseClient instance.
 * No hard dependency: the client is injected. Re-queries when `table()` changes.
 * When `client` is nullish the hook stays idle (`isConfigured() === false`).
 *
 * @param client — SupabaseClient (structurally typed — any `from().select()` chain works)
 * @param table — Accessor for the table name
 * @param columns — Columns to select. @default "*"
 * @returns `{ rows, error, loading, isConfigured, status, refetch }`
 *
 * @example
 * const todos = useSupabase<Todo>(supabase, "todos", "id,title,done");
 * <For each={todos.rows()}>{(t) => <li>{t.title}</li>}</For>
 */
export function useSupabase<T = Record<string, unknown>>(
	client: SupabaseLike | null | undefined,
	table: Accessor<string>,
	columns = "*",
): SupabaseQueryState<T> {
	const [rows, setRows] = createSignal<T[]>();
	const [error, setError] = createSignal<Error>();
	const [loading, setLoading] = createSignal(client != null);
	const [status, setStatus] = createSignal<SupabaseStatus>("idle");
	const isConfigured: Accessor<boolean> = () => client != null;
	let gen = 0;

	const run = (t: string) => {
		if (!client) {
			setLoading(false);
			setStatus("idle");
			return;
		}
		const id = ++gen;
		setLoading(true);
		setStatus("loading");
		Promise.resolve(client.from(t).select(columns))
			.then((res) => {
				if (id !== gen) return;
				if (res.error) throw toError(res.error);
				setRows(res.data as T[]);
				setError(undefined);
				setStatus("success");
			})
			.catch((e) => {
				if (id !== gen) return;
				setError(toError(e));
				setStatus("error");
			})
			.finally(() => {
				if (id === gen) setLoading(false);
			});
	};

	createEffect(() => run(table()));
	onCleanup(() => gen++);

	return { rows, error, loading, isConfigured, status, refetch: () => run(table()) };
}
