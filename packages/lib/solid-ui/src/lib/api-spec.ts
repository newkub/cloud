/** Shared API endpoint spec used by ApiPlayground and ApiReference. */
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface ApiParameter {
	name: string;
	in: "query" | "path" | "header" | "cookie";
	required?: boolean;
	description?: string;
	schema?: unknown;
	example?: unknown;
}

export interface GraphQlSpec {
	/** GraphQL operation name. */
	operation?: string;
	/** GraphQL query or mutation. */
	query: string;
	/** Example variables. */
	variables?: Record<string, unknown>;
}

export interface CliArg {
	name: string;
	required?: boolean;
	description?: string;
	example?: string;
}

export interface CliSpec {
	/** Base command, e.g. "wrikka". */
	command: string;
	subcommand?: string;
	args?: CliArg[];
}

export interface ApiSpec {
	id?: string;
	method: ApiMethod;
	path: string;
	summary?: string;
	description?: string;
	tag?: string;
	parameters?: ApiParameter[];
	requestBody?: {
		description?: string;
		required?: boolean;
		example?: unknown;
		contentType?: string;
	};
	responses?: Record<string, { description: string; example?: unknown }>;
	/** Absolute base URL used by the playground. Defaults to origin. */
	server?: string;
	graphql?: GraphQlSpec;
	cli?: CliSpec;
}
