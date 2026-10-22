/**
 * SnippetCard — shareable code snippet with language badge, copy and optional line numbers.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SnippetCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	code: string;
	/** Language label + badge, e.g. "tsx". */
	language?: string;
	title?: string;
	/** Show line numbers. @default false */
	lineNumbers?: boolean;
	/** Copy button in header. @default true */
	copyable?: boolean;
	/** Highlight these 1-based line numbers. */
	highlightLines?: number[];
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Max code height before scroll. */
	maxHeight?: string;
}

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function SnippetCard(props: SnippetCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"code",
		"language",
		"title",
		"lineNumbers",
		"copyable",
		"highlightLines",
		"variant",
		"size",
		"radius",
		"elevation",
		"maxHeight",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const lines = () => (local.code ?? "").replace(/\n$/, "").split("\n");
	const copy = () => void copyText(local.code);

	return (
		<div
			class={`solidui-snippet-card overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title || local.language || (local.copyable ?? true)}>
				<div class="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-1.5">
					<Show when={local.language}>
						<span class="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-2xs font-medium text-primary">
							{local.language}
						</span>
					</Show>
					<Show when={local.title}>
						<span class={`truncate text-muted-foreground ${textSize[local.size ?? "md"]}`}>{local.title}</span>
					</Show>
					<Show when={local.copyable ?? true}>
						<button
							type="button"
							aria-label={copied() ? "Copied" : "Copy snippet"}
							class="ml-auto flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={copy}
						>
							{copied() ? (
								<svg
									class="h-3.5 w-3.5 text-success"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							) : (
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<rect x="9" y="9" width="12" height="12" rx="2" />
									<path d="M5 15V5a2 2 0 0 1 2-2h10" />
								</svg>
							)}
						</button>
					</Show>
				</div>
			</Show>
			<pre
				class={`overflow-auto p-3 font-mono text-foreground/90 ${textSize[local.size ?? "md"]}`}
				style={{ "max-height": local.maxHeight }}
			>
				<For each={lines()}>
					{(line, i) => (
						<div class={(local.highlightLines ?? []).includes(i() + 1) ? "-mx-3 bg-primary/10 px-3" : ""}>
							<Show when={local.lineNumbers}>
								<span class="mr-3 inline-block w-6 select-none text-right tabular-nums text-muted-foreground/50">
									{i() + 1}
								</span>
							</Show>
							{line || " "}
						</div>
					)}
				</For>
			</pre>
		</div>
	);
}
