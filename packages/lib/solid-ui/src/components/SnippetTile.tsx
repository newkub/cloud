/**
 * SnippetTile — compact code tile: language badge, tinted mono code lines and a copy button.
 */
import { For, Index, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { CopyButton } from "./CopyButton";

export interface SnippetTileProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onCopy"> {
	/** Optional tile title shown next to the language badge. */
	title?: string;
	/** Language label for the badge, e.g. "ts". */
	language?: string;
	/** Raw code — rendered line by line with light syntax tinting. */
	code?: string;
	/** Max rendered lines before truncating. @default 3 */
	maxLines?: number;
	/** Called when the copy button is clicked. */
	onCopy?: (code: string) => void;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const keywords = new Set([
	"const",
	"let",
	"var",
	"function",
	"return",
	"import",
	"export",
	"from",
	"await",
	"async",
	"new",
	"if",
	"else",
	"for",
	"while",
	"type",
	"interface",
	"extends",
	"class",
	"def",
	"fn",
	"use",
	"pub",
	"struct",
	"impl",
	"match",
	"package",
	"func",
	"switch",
	"case",
	"break",
	"continue",
	"typeof",
	"enum",
	"try",
	"catch",
	"throw",
	"yield",
	"static",
	"true",
	"false",
	"null",
	"undefined",
]);

interface Token {
	text: string;
	cls: string;
}

const tokenRe =
	/(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d[\d_]*(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;

const tokenize = (line: string): Token[] => {
	const out: Token[] = [];
	let last = 0;
	for (const m of line.matchAll(tokenRe)) {
		const i = m.index;
		if (i > last) out.push({ text: line.slice(last, i), cls: "text-foreground" });
		const t = m[0];
		let cls = "text-foreground";
		if (t.startsWith("//") || t.startsWith("#")) cls = "text-muted-foreground";
		else if (t.startsWith('"') || t.startsWith("'") || t.startsWith("`")) cls = "text-success";
		else if (/^\d/.test(t)) cls = "text-warning";
		else if (keywords.has(t)) cls = "text-primary";
		out.push({ text: t, cls });
		last = i + t.length;
	}
	if (last < line.length) out.push({ text: line.slice(last), cls: "text-foreground" });
	return out;
};

export function SnippetTile(props: SnippetTileProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"language",
		"code",
		"maxLines",
		"onCopy",
		"variant",
		"radius",
		"elevation",
	]);
	const lines = () => (local.code ?? "").split("\n").slice(0, local.maxLines ?? 3);
	const truncated = () => (local.code ?? "").split("\n").length > lines().length;
	return (
		<div
			class={`solidui-snippet-tile border p-3 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2">
				<span class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-3xs font-medium uppercase text-muted-foreground">
					{local.language ?? ""}
				</span>
				<Show when={local.title}>
					<span class="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{local.title}</span>
				</Show>
				<CopyButton
					iconOnly
					value={local.code ?? ""}
					label="Copy snippet"
					copiedLabel="Copied"
					class="ml-auto shrink-0"
					onClick={() => local.onCopy?.(local.code ?? "")}
				/>
			</div>
			<pre class="mt-2 overflow-x-auto rounded-md bg-muted/50 p-2.5 font-mono text-2xs leading-relaxed">
				<Index each={lines()}>
					{(line, i) => (
						<div class="flex whitespace-pre">
							<span class="w-5 shrink-0 select-none pr-2 text-right text-muted-foreground/60">{i + 1}</span>
							<code>
								<For each={tokenize(line())}>{(tok) => <span class={tok.cls}>{tok.text}</span>}</For>
							</code>
						</div>
					)}
				</Index>
				<Show when={truncated()}>
					<div class="flex whitespace-pre">
						<span class="w-5 shrink-0 select-none pr-2 text-right text-muted-foreground/60">…</span>
					</div>
				</Show>
			</pre>
		</div>
	);
}
