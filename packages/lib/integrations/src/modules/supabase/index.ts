// ============================================================================
// Supabase Integration — REST adapter using the built-in Supabase PostgREST API
// ============================================================================

export interface SupabaseConfig {
	url: string;
	key: string;
}

export interface SupabaseQueryBuilder {
	select(): Promise<unknown[]>;
}

export interface SupabaseClientPort {
	from(table: string): SupabaseQueryBuilder;
}

class SupabaseRestAdapter implements SupabaseClientPort {
	private readonly url: string;
	private readonly key: string;

	constructor(config: SupabaseConfig) {
		this.url = config.url.replace(/\/$/, "");
		this.key = config.key;
	}

	from(table: string): SupabaseQueryBuilder {
		const url = this.url;
		const key = this.key;

		return {
			async select(): Promise<unknown[]> {
				const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
					headers: {
						apikey: key,
						Authorization: `Bearer ${key}`,
						Accept: "application/vnd.pgrst.object+json",
					},
				});

				if (!res.ok) {
					throw new Error(
						`Supabase API error: ${res.status} ${res.statusText}`,
					);
				}

				return (await res.json()) as unknown[];
			},
		};
	}
}

export const createSupabaseClient = (
	config: SupabaseConfig,
): SupabaseClientPort => {
	if (!config.url || !config.key) {
		throw new Error("Supabase URL and key are required");
	}
	return new SupabaseRestAdapter(config);
};
