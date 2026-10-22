/**
 * Markdown - renders markdown text as styled HTML.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface MarkdownProps extends JSX.HTMLAttributes<HTMLDivElement> {
	content?: string;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
}

const inline = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">$1</code>')
		.replace(
			/\[(.+?)\]\((.+?)\)/g,
			'<a class="rounded text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" href="$2">$1</a>',
		);

function renderMarkdown(src: string): string {
	const blocks: string[] = [];
	const lines = src.split("\n");
	let list: string[] = [];

	const flushList = () => {
		if (list.length) {
			blocks.push(`<ul class="my-2 list-inside list-disc space-y-1">${list.join("")}</ul>`);
			list = [];
		}
	};

	for (const raw of lines) {
		const line = raw.trimEnd();
		if (/^#{1,3}\s/.test(line)) {
			flushList();
			const level = line.match(/^#{1,3}/)?.[0].length ?? 1;
			const text = inline(line.replace(/^#{1,3}\s*/, ""));
			const cls =
				level === 1
					? "mb-3 mt-4 text-2xl font-bold first:mt-0"
					: level === 2
						? "mb-2 mt-3 text-xl font-semibold first:mt-0"
						: "mb-2 mt-3 text-lg font-semibold first:mt-0";
			blocks.push(`<h${level} class="${cls}">${text}</h${level}>`);
		} else if (/^[-*]\s/.test(line)) {
			list.push(`<li>${inline(line.replace(/^[-*]\s*/, ""))}</li>`);
		} else if (line.trim() === "") {
			flushList();
		} else {
			flushList();
			blocks.push(`<p class="my-2 leading-7">${inline(line)}</p>`);
		}
	}
	flushList();
	return blocks.join("\n");
}

export function Markdown(props: MarkdownProps) {
	const [local, rest] = splitProps(props, ["class", "children", "content", "variant", "size", "radius"]);
	const html = () => renderMarkdown(local.content ?? "");

	const className = () =>
		[
			"text-sm text-foreground",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show
			when={local.content}
			fallback={
				<div class={className()} {...rest}>
					{local.children}
				</div>
			}
		>
			{/* content is escaped in inline() before markdown formatting is applied */}
			<div class={className()} innerHTML={html()} {...rest} />
		</Show>
	);
}
