/**
 * MermaidBlock - framed mermaid diagram source. Renders `<pre class="mermaid">`
 * so a host app can hydrate it with mermaid.js, plus a copy button.
 */

import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { CopyButton } from "./CopyButton";

export interface MermaidBlockProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Mermaid diagram source. */
	code: string;
	/** Frame label. @default "Diagram" */
	title?: string;
	/** Show the copy button. @default true */
	showCopy?: boolean;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function MermaidBlock(props: MermaidBlockProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"code",
		"title",
		"showCopy",
		"variant",
		"radius",
		"unstyled",
		"children",
	]);

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-mermaid-block overflow-hidden border",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<figure class={className()} {...rest}>
			<figcaption class="flex items-center justify-between gap-2 border-b border-border bg-surface/50 px-3 py-1.5">
				<span class="text-xs text-muted-foreground">{local.title ?? "Diagram"}</span>
				<Show when={local.showCopy ?? true}>
					<CopyButton value={local.code} iconOnly aria-label="Copy diagram source" />
				</Show>
			</figcaption>
			{/* Host apps hydrate this node with mermaid.run() / mermaid.init(). */}
			<pre class="mermaid overflow-auto p-4 font-mono text-sm" data-diagram="mermaid">
				{local.code}
			</pre>
			{local.children}
		</figure>
	);
}
