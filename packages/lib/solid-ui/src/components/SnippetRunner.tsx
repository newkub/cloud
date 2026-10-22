/**
 * SnippetRunner - code card with a Run button that renders async output or errors.
 */

import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

type RunState = "idle" | "running" | "done" | "error";

export interface SnippetRunnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Code shown in the card and passed to `run`. */
	code: string;
	/** Async executor — resolves to a value rendered as output, rejections render as errors. */
	run: (code: string) => Promise<unknown>;
	/** Run button label. @default "Run" */
	runLabel?: string;
	/** Card title. @default "Snippet" */
	title?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const format = (v: unknown) => (typeof v === "string" ? v : (JSON.stringify(v, null, 2) ?? String(v)));

export function SnippetRunner(props: SnippetRunnerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"code",
		"run",
		"runLabel",
		"title",
		"variant",
		"radius",
		"unstyled",
	]);
	const [state, setState] = createSignal<RunState>("idle");
	const [output, setOutput] = createSignal("");

	const execute = async () => {
		if (state() === "running") return;
		setState("running");
		setOutput("");
		try {
			setOutput(format(await local.run(local.code)));
			setState("done");
		} catch (e) {
			setOutput(e instanceof Error ? e.message : String(e));
			setState("error");
		}
	};

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-snippet-runner overflow-hidden border",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center justify-between gap-2 border-b border-border bg-surface/50 px-3 py-1.5">
				<span class="text-xs font-medium text-muted-foreground">{local.title ?? "Snippet"}</span>
				<button
					type="button"
					onClick={() => void execute()}
					disabled={state() === "running"}
					class="inline-flex h-7 items-center gap-1.5 rounded border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				>
					{state() === "running" ? "Running…" : (local.runLabel ?? "Run")}
				</button>
			</div>
			<pre class="overflow-auto bg-muted/50 p-3 font-mono text-sm">{local.code}</pre>
			<Show when={state() !== "idle"}>
				<div
					class="border-t border-border p-3"
					role={state() === "error" ? "alert" : "status"}
					aria-live={state() === "error" ? undefined : "polite"}
				>
					<Show when={state() !== "running"} fallback={<span class="text-xs text-muted-foreground">Running…</span>}>
						<pre
							class={`whitespace-pre-wrap font-mono text-xs ${state() === "error" ? "text-destructive" : "text-foreground"}`}
							data-testid="snippet-output"
						>
							{output()}
						</pre>
					</Show>
				</div>
			</Show>
		</div>
	);
}
