/**
 * ApiPlayground - interactive request builder for REST, GraphQL and CLI specs.
 * Ported from create-docs runtime; fully prop-driven (no framework context).
 */

import { createSignal, type JSX, Show, splitProps } from "solid-js";
import type { ApiSpec } from "../lib/api-spec";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CliEditor } from "./api-playground/CliEditor";
import { buildCurl } from "./api-playground/commands";
import { GraphqlEditor } from "./api-playground/GraphqlEditor";
import { icon } from "./api-playground/icons";
import { ParamsEditor } from "./api-playground/ParamsEditor";
import { type PlaygroundResult, ResultView } from "./api-playground/ResultView";
import { areaClass, labelClass, METHOD_COLOR } from "./api-playground/styles";

export interface ApiPlaygroundProps extends JSX.HTMLAttributes<HTMLDivElement> {
	endpoint?: ApiSpec;
	/** Which editor UI to show. Inferred from the spec when omitted. */
	variant?: "rest" | "graphql" | "cli";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
}

export function ApiPlayground(props: ApiPlaygroundProps) {
	const [local, rest] = splitProps(props, ["class", "endpoint", "variant", "radius", "elevation", "fullWidth"]);
	const ep = () => local.endpoint ?? ({} as ApiSpec);
	const variant = () => local.variant ?? (ep().graphql ? "graphql" : ep().cli ? "cli" : "rest");

	const [paramValues, setParamValues] = createSignal<Record<string, string>>({});
	const [argValues, setArgValues] = createSignal<Record<string, string>>({});
	const [body, setBody] = createSignal(
		ep().requestBody?.example != null ? JSON.stringify(ep().requestBody?.example, null, 2) : "",
	);
	const [query, setQuery] = createSignal(ep().graphql?.query ?? "");
	const [variables, setVariables] = createSignal(
		ep().graphql?.variables != null ? JSON.stringify(ep().graphql?.variables, null, 2) : "",
	);
	const [sending, setSending] = createSignal(false);
	const [result, setResult] = createSignal<PlaygroundResult | null>(null);
	const [error, setError] = createSignal("");

	const setParam = (name: string, value: string) => setParamValues((p) => ({ ...p, [name]: value }));
	const setArg = (name: string, value: string) => setArgValues((p) => ({ ...p, [name]: value }));

	const resolvedUrl = () => {
		let path = ep().path;
		const queryParams = new URLSearchParams();
		for (const p of ep().parameters ?? []) {
			const v = paramValues()[p.name] ?? "";
			if (p.in === "path") path = path.replace(`{${p.name}}`, v || `{${p.name}}`);
			else if (p.in === "query" && v) queryParams.set(p.name, v);
		}
		const base = ep().server ?? "";
		const qs = queryParams.toString();
		return `${base}${path}${qs ? `?${qs}` : ""}`;
	};

	const send = async () => {
		setSending(true);
		setError("");
		setResult(null);
		const t0 = performance.now();
		try {
			let requestBody: string | undefined;
			let headers: Record<string, string> | undefined;

			if (variant() === "graphql") {
				const vars = variables().trim() ? (JSON.parse(variables()) as Record<string, unknown>) : {};
				requestBody = JSON.stringify({ query: query(), variables: vars });
				headers = { "Content-Type": "application/json" };
			} else if (body().trim()) {
				requestBody = body();
				headers = { "Content-Type": "application/json" };
			}

			const res = await fetch(resolvedUrl(), {
				method: ep().method,
				headers,
				body: ep().method === "GET" || !requestBody ? undefined : requestBody,
			});
			const text = await res.text();
			setResult({ status: res.status, ms: Math.round(performance.now() - t0), body: text });
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setSending(false);
		}
	};

	const isCli = () => variant() === "cli";
	const isGraphql = () => variant() === "graphql";
	const params = () => ep().parameters ?? [];

	return (
		<div
			class={`solidui-api-playground overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.fullWidth === false ? "" : "w-full"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={!isCli()}>
				<div class="flex items-center gap-2 px-3 py-2 border-b border-border">
					<span class={`text-xs font-bold ${METHOD_COLOR[ep().method] ?? "text-foreground"}`}>{ep().method}</span>
					<code class="text-xs text-muted-foreground font-mono truncate flex-1">{resolvedUrl() || ep().path}</code>
				</div>
			</Show>

			<div class="p-3 flex flex-col gap-3">
				<Show when={isGraphql()}>
					<GraphqlEditor
						query={query()}
						variables={variables()}
						onQueryInput={setQuery}
						onVariablesInput={setVariables}
					/>
				</Show>

				<Show when={isCli()}>
					<CliEditor spec={ep()} argValues={argValues()} onArgChange={setArg} />
				</Show>

				<Show when={params().length > 0 && !isGraphql() && !isCli()}>
					<ParamsEditor params={params()} values={paramValues()} onChange={setParam} />
				</Show>

				<Show when={ep().requestBody && !isGraphql() && !isCli()}>
					<div>
						<p class={labelClass}>Body</p>
						<textarea
							value={body()}
							onInput={(e) => setBody(e.currentTarget.value)}
							rows={6}
							spellcheck={false}
							class={areaClass}
							aria-label="Request body"
						/>
					</div>
				</Show>

				<Show when={!isCli()}>
					<button
						type="button"
						onClick={send}
						disabled={sending()}
						class="inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer border-none disabled:opacity-50"
					>
						{sending() ? icon.spin : icon.send}
						{sending() ? "Sending…" : isGraphql() ? "Run query" : "Send request"}
					</button>
				</Show>

				<Show when={error()}>
					<p class="text-xs text-destructive m-0" role="alert">
						{error()}
					</p>
				</Show>

				<Show when={result()}>{(r) => <ResultView result={r()} />}</Show>

				<Show when={!isCli() && !isGraphql()}>
					<details class="text-xs text-muted-foreground">
						<summary class="cursor-pointer select-none">cURL</summary>
						<pre class="m-0 mt-1.5 p-2 rounded border border-border bg-background font-mono text-foreground overflow-auto whitespace-pre-wrap">
							{buildCurl(ep(), resolvedUrl(), body())}
						</pre>
					</details>
				</Show>
			</div>
		</div>
	);
}
