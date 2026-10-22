/**
 * CodeBlock component — syntax block with header, copy button, line numbers and line highlighting.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "bg-muted",
};

export interface CodeBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	code?: string;
	language?: string;
	/** Show the copy button (default true). `copyButton` is accepted as an alias. */
	showCopy?: boolean;
	copyButton?: boolean;
	/** Filename label rendered in the header. */
	filename?: string;
	/** Render a gutter with 1-based line numbers. */
	lineNumbers?: boolean;
	/** 1-based line numbers to highlight. */
	highlightLines?: number[];
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
}

export function CodeBlock(props: CodeBlockProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"code",
		"language",
		"showCopy",
		"copyButton",
		"filename",
		"lineNumbers",
		"highlightLines",
		"variant",
		"size",
		"radius",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);

	const codeText = () => local.code ?? String(local.children ?? "");
	const lines = () => codeText().split("\n");
	const showCopy = () => local.showCopy ?? local.copyButton ?? true;
	const highlighted = () => new Set(local.highlightLines ?? []);
	// Friendly badge: txt/plaintext read "TEXT", shell aliases read "BASH".
	const langLabel = () => {
		const l = (local.language ?? "").toLowerCase();
		if (l === "txt" || l === "text" || l === "plaintext" || l === "plain") return "text";
		if (l === "sh" || l === "shell" || l === "zsh" || l === "shellscript") return "bash";
		return local.language;
	};

	const copy = () => void copyText(codeText());

	const className = () =>
		[
			"relative overflow-hidden ",
			variantMap[local.variant ?? "default"],
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<Show when={local.filename || local.language || showCopy()}>
				<div class="flex items-center justify-between gap-2 border-b border-border bg-surface/50 px-3 py-1.5">
					<div class="flex min-w-0 items-center gap-2">
						<Show when={local.filename}>
							<span class="truncate font-mono text-xs text-foreground/80">{local.filename}</span>
						</Show>
						<Show when={langLabel() && langLabel() !== local.filename}>
							<span class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-2xs uppercase tracking-wide text-muted-foreground">
								{langLabel()}
							</span>
						</Show>
						<Show when={!local.filename && !local.language}>
							<span class="text-xs text-muted-foreground">code</span>
						</Show>
					</div>
					<Show when={showCopy()}>
						<button
							type="button"
							class="-m-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={copy}
							aria-label={copied() ? "Copied!" : "Copy"}
							title={copied() ? "Copied!" : "Copy"}
						>
							<Show
								when={copied()}
								fallback={
									<svg
										class="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<rect x="9" y="9" width="13" height="13" rx="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
								}
							>
								<svg
									class="h-3.5 w-3.5 text-success"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
							</Show>
						</button>
					</Show>
				</div>
			</Show>
			<Show
				when={local.lineNumbers || highlighted().size > 0}
				fallback={
					<pre class={`overflow-auto font-mono text-sm ${paddingSizes[local.size ?? "md"]}`}>
						<code>{codeText()}</code>
					</pre>
				}
			>
				<pre class={`overflow-auto font-mono text-sm ${paddingSizes[local.size ?? "md"]} py-2`}>
					<For each={lines()}>
						{(line, i) => (
							<div
								class={`flex ${highlighted().has(i() + 1) ? "border-l-2 border-primary bg-primary/10" : "border-l-2 border-transparent"}`}
							>
								<Show when={local.lineNumbers}>
									<span class="w-10 shrink-0 select-none border-r border-border/50 pr-3 text-right text-muted-foreground/50">
										{i() + 1}
									</span>
								</Show>
								<code class="flex-1 whitespace-pre pl-3">{line || " "}</code>
							</div>
						)}
					</For>
				</pre>
			</Show>
		</div>
	);
}
