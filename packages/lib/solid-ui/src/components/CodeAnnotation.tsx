/**
 * CodeAnnotation - code block with numbered callout markers and a matching legend below.
 */

import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface CodeAnnotationItem {
	/** 1-based line number the annotation targets. */
	line: number;
	/** Callout text shown in the legend below the code. */
	text: string;
}

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "bg-muted" };

export interface CodeAnnotationProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Source code rendered line by line. */
	code: string;
	/** Callouts keyed by 1-based line number — rendered as numbered markers. */
	annotations?: CodeAnnotationItem[];
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CodeAnnotation(props: CodeAnnotationProps) {
	const [local, rest] = splitProps(props, ["class", "code", "annotations", "variant", "radius", "unstyled"]);

	/** Annotations sorted by line — marker number is the index in this list. */
	const sorted = () =>
		[...(local.annotations ?? [])].sort((a, b) => a.line - b.line).map((a, i) => ({ ...a, n: i + 1 }));
	const lines = () => (local.code ?? "").split("\n");
	const markersFor = (line: number) => sorted().filter((a) => a.line === line);

	const markerClass = (styled: boolean) =>
		`inline-flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full text-2xs font-semibold${
			styled ? " border border-primary/30 bg-primary/10 text-primary" : ""
		}`;

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-code-annotation overflow-hidden border",
					variantMap[local.variant ?? "default"],
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<pre class="overflow-auto py-2 font-mono text-sm">
				<For each={lines()}>
					{(line, i) => (
						<div
							class={`flex items-center gap-2 border-l-2 px-3 ${
								markersFor(i() + 1).length > 0 ? "border-primary/40 bg-primary/5" : "border-transparent"
							}`}
						>
							<code class="flex-1 whitespace-pre">{line || " "}</code>
							<For each={markersFor(i() + 1)}>{(a) => <span class={markerClass(!local.unstyled)}>{a.n}</span>}</For>
						</div>
					)}
				</For>
			</pre>
			<Show when={sorted().length > 0}>
				<ol class="space-y-2 border-t border-border px-4 py-3">
					<For each={sorted()}>
						{(a) => (
							<li class="flex items-start gap-2.5 text-sm">
								<span class={`${markerClass(!local.unstyled)} mt-0.5`}>{a.n}</span>
								<span class="text-muted-foreground">
									<span class="sr-only">Line {a.line}: </span>
									{a.text}
								</span>
							</li>
						)}
					</For>
				</ol>
			</Show>
		</div>
	);
}
