/**
 * MarkdownEditor - textarea with a formatting toolbar and a live preview toggle.
 */

import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { type MarkdownCommand, MarkdownToolbar } from "./MarkdownToolbar";
import { Textarea } from "./Textarea";

export interface MarkdownEditorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled markdown source. */
	value?: string;
	/** Initial markdown source for uncontrolled usage. */
	defaultValue?: string;
	/** Called with the full markdown source after every edit. */
	onChange?: (value: string) => void;
	/** Custom preview renderer — receives the markdown source. Falls back to a minimal built-in renderer. */
	preview?: (md: string) => JSX.Element;
	/** Rows for the textarea. @default 6 */
	rows?: number;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

/** Minimal inline renderer — bold, italic, inline code and links only. */
const inline = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">$1</code>')
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a class="text-primary hover:underline" href="$2">$1</a>');

function renderPreview(src: string): JSX.Element {
	const lines = src.split("\n").filter((l) => l.trim() !== "");
	if (lines.length === 0) {
		return <p class="text-sm text-muted-foreground">Nothing to preview</p>;
	}
	return <For each={lines}>{(line) => <p class="text-sm text-foreground" innerHTML={inline(line)} />}</For>;
}

export function MarkdownEditor(props: MarkdownEditorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"preview",
		"rows",
		"variant",
		"radius",
		"unstyled",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [showPreview, setShowPreview] = createSignal(false);
	const current = () => (local.value !== undefined ? local.value : internal());
	let ref: HTMLTextAreaElement | undefined;

	const commit = (next: string) => {
		setInternal(next);
		local.onChange?.(next);
	};

	/** Wrap the current selection in `before`/`after`, or insert a placeholder pair. */
	const surround = (before: string, after: string, placeholder = "text") => {
		const el = ref;
		const src = current();
		const start = el?.selectionStart ?? src.length;
		const end = el?.selectionEnd ?? start;
		const sel = src.slice(start, end) || placeholder;
		const next = `${src.slice(0, start)}${before}${sel}${after}${src.slice(end)}`;
		commit(next);
		queueMicrotask(() => {
			if (!el) return;
			el.focus();
			el.setSelectionRange(start + before.length, start + before.length + sel.length);
		});
	};

	/** Prefix every selected line — used by list/quote commands. */
	const prefixLines = (prefix: string) => {
		const el = ref;
		const src = current();
		const start = el?.selectionStart ?? src.length;
		const end = el?.selectionEnd ?? start;
		const selected = src.slice(start, end) || "item";
		const replaced = selected
			.split("\n")
			.map((l) => `${prefix}${l}`)
			.join("\n");
		commit(`${src.slice(0, start)}${replaced}${src.slice(end)}`);
	};

	const apply = (command: MarkdownCommand) => {
		switch (command) {
			case "bold":
				surround("**", "**");
				break;
			case "italic":
				surround("*", "*");
				break;
			case "code":
				surround("`", "`", "code");
				break;
			case "link":
				surround("[", "](https://)", "link text");
				break;
			case "list":
				prefixLines("- ");
				break;
			case "quote":
				prefixLines("> ");
				break;
		}
	};

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-markdown-editor overflow-hidden border",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center justify-between gap-2 border-b border-border px-2 py-1.5">
				<MarkdownToolbar onAction={apply} disabled={showPreview()} />
				<button
					type="button"
					aria-pressed={showPreview()}
					onClick={() => setShowPreview((v) => !v)}
					class="inline-flex h-7 items-center rounded border border-border bg-background px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					{showPreview() ? "Edit" : "Preview"}
				</button>
			</div>
			<Show
				when={showPreview()}
				fallback={
					<Textarea
						ref={(el) => (ref = el)}
						value={current()}
						onChange={commit}
						rows={local.rows ?? 6}
						resize="vertical"
						aria-label="Markdown editor"
						class="rounded-none border-0 font-mono shadow-none focus-visible:ring-0"
					/>
				}
			>
				<div class="min-h-16 space-y-1 p-3" data-testid="markdown-preview">
					{(local.preview ?? renderPreview)(current())}
				</div>
			</Show>
		</div>
	);
}
