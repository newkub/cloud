/**
 * RequestBuilder — scratchpad HTTP client: colored method select, URL input,
 * send button and a response pane. Unlike ApiPlayground (spec-driven), the
 * request is free-form and `onSend` is pluggable — omit it to show the
 * "ready" pane.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface BuilderRequest {
	method: string;
	url: string;
	body?: string;
}

export interface BuilderResponse {
	/** HTTP status code */
	status: number;
	/** Reason phrase, e.g. "OK" */
	statusText?: string;
	/** Round-trip time in ms */
	ms?: number;
	/** Raw response body */
	body: string;
}

export interface RequestBuilderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSend"> {
	/** Selectable methods. @default ["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"] */
	methods?: string[];
	/** Initial method. @default "GET" */
	method?: string;
	/** Initial request URL. */
	url?: string;
	/** Initial body — shown for non-GET/HEAD methods. */
	body?: string;
	/** Called with the built request; return (or resolve) the response to display. Omit to keep the ready pane. */
	onSend?: (req: BuilderRequest) => BuilderResponse | Promise<BuilderResponse>;
	/** Corner radius. */
	radius?: Radius;
}

const METHOD_COLOR: Record<string, string> = {
	GET: "text-info",
	POST: "text-success",
	PUT: "text-warning",
	PATCH: "text-warning",
	DELETE: "text-destructive",
	HEAD: "text-muted-foreground",
	OPTIONS: "text-muted-foreground",
};

const statusChip = (status: number) =>
	status < 300
		? "border-success/30 bg-success/10 text-success"
		: status < 400
			? "border-info/30 bg-info/10 text-info"
			: "border-destructive/30 bg-destructive/10 text-destructive";

const fieldClass =
	"h-8 px-2 rounded-md border border-border bg-background text-xs font-mono text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function RequestBuilder(props: RequestBuilderProps) {
	const [local, rest] = splitProps(props, ["class", "methods", "method", "url", "body", "onSend", "radius"]);
	const [method, setMethod] = createSignal(local.method ?? "GET");
	const [url, setUrl] = createSignal(local.url ?? "");
	const [body, setBody] = createSignal(local.body ?? "");
	const [sending, setSending] = createSignal(false);
	const [resp, setResp] = createSignal<BuilderResponse | null>(null);
	const [error, setError] = createSignal("");

	const methods = () => local.methods ?? ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
	const hasBody = () => method() !== "GET" && method() !== "HEAD";

	const send = async () => {
		const handler = local.onSend;
		if (!handler) return;
		setSending(true);
		setError("");
		setResp(null);
		try {
			setResp(await handler({ method: method(), url: url(), body: hasBody() ? body() : undefined }));
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setSending(false);
		}
	};

	const prettyBody = () => {
		const r = resp();
		if (!r) return "";
		try {
			return JSON.stringify(JSON.parse(r.body), null, 2);
		} catch {
			return r.body;
		}
	};

	return (
		<div
			class={`solidui-request-builder overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2 border-b border-border p-2">
				<select
					class={`${fieldClass} w-24 shrink-0 cursor-pointer font-bold ${METHOD_COLOR[method()] ?? "text-foreground"}`}
					value={method()}
					aria-label="HTTP method"
					onChange={(e) => setMethod(e.currentTarget.value)}
				>
					<For each={methods()}>{(m) => <option value={m}>{m}</option>}</For>
				</select>
				<input
					type="url"
					class={`${fieldClass} min-w-0 flex-1`}
					placeholder="https://api.example.com/v1/endpoint"
					aria-label="Request URL"
					value={url()}
					onInput={(e) => setUrl(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") send();
					}}
				/>
				<button
					type="button"
					class="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					disabled={sending() || !local.onSend || !url().trim()}
					onClick={send}
				>
					{sending() ? "Sending…" : "Send"}
				</button>
			</div>
			<Show when={hasBody()}>
				<textarea
					class="block w-full resize-y border-0 border-b border-border bg-background px-3 py-2 font-mono text-xs text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
					rows={4}
					spellcheck={false}
					placeholder='{"key": "value"}'
					aria-label="Request body"
					value={body()}
					onInput={(e) => setBody(e.currentTarget.value)}
				/>
			</Show>
			<div class="p-3" aria-live="polite">
				<Show when={error()}>
					<p class="m-0 text-xs text-destructive" role="alert">
						{error()}
					</p>
				</Show>
				<Show when={resp()}>
					{(r) => (
						<div>
							<div class="mb-1.5 flex items-center gap-2">
								<span
									class={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-2xs font-semibold ${statusChip(r().status)}`}
								>
									{r().status}
									{r().statusText ? ` ${r().statusText}` : ""}
								</span>
								<Show when={r().ms !== undefined}>
									<span class="text-2xs text-muted-foreground">{r().ms}ms</span>
								</Show>
							</div>
							<pre class="m-0 max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background p-2 font-mono text-xs text-foreground">
								{prettyBody()}
							</pre>
						</div>
					)}
				</Show>
				<Show when={!resp() && !error()}>
					<p class="m-0 text-xs text-muted-foreground">
						{local.onSend
							? "No response yet — send the request to see the result."
							: "Ready — provide an onSend handler to execute requests."}
					</p>
				</Show>
			</div>
		</div>
	);
}
