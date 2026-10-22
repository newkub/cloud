/**
 * MarkdownToolbar — formatting toolbar for markdown editors. Renders
 * bold/italic, link/code and list/quote action groups; each button reports
 * its command via `onAction` and reflects pressed state via `active`.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type MarkdownCommand = "bold" | "italic" | "link" | "code" | "list" | "quote";

interface ToolbarButton {
	command: MarkdownCommand;
	label: string;
	icon: JSX.Element;
}

const groups: ToolbarButton[][] = [
	[
		{
			command: "bold",
			label: "Bold",
			icon: <span class="text-xs font-bold leading-none">B</span>,
		},
		{
			command: "italic",
			label: "Italic",
			icon: <span class="text-xs italic leading-none">I</span>,
		},
	],
	[
		{
			command: "link",
			label: "Insert link",
			icon: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
					/>
				</svg>
			),
		},
		{
			command: "code",
			label: "Inline code",
			icon: <span class="font-mono text-2xs leading-none">{"<>"}</span>,
		},
	],
	[
		{
			command: "list",
			label: "Bullet list",
			icon: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h.01M4 12h.01M4 18h.01M9 6h11M9 12h11M9 18h11" />
				</svg>
			),
		},
		{
			command: "quote",
			label: "Quote",
			icon: <span class="font-serif text-sm leading-none">{"\u201C"}</span>,
		},
	],
];

export interface MarkdownToolbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called with the command name when a toolbar button is activated. */
	onAction?: (command: MarkdownCommand) => void;
	/** Commands rendered pressed (aria-pressed + active styling). @default [] */
	active?: MarkdownCommand[];
	/** Disable every button. @default false */
	disabled?: boolean;
	/** Toolbar orientation. @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	/** Corner radius. */
	radius?: Radius;
}

export function MarkdownToolbar(props: MarkdownToolbarProps) {
	const [local, rest] = splitProps(props, ["class", "onAction", "active", "disabled", "orientation", "radius"]);
	const active = () => local.active ?? [];
	const vertical = () => local.orientation === "vertical";

	return (
		<div
			role="toolbar"
			aria-label="Markdown formatting"
			aria-orientation={local.orientation ?? "horizontal"}
			class={`solidui-markdown-toolbar inline-flex gap-0.5 border border-border bg-surface p-1 ${vertical() ? "flex-col items-center" : "items-center"} ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={groups}>
				{(group, gi) => (
					<>
						<Show when={gi() > 0}>
							<span aria-hidden="true" class={vertical() ? "my-1 h-px w-4 bg-border" : "mx-1 h-4 w-px bg-border"} />
						</Show>
						<For each={group}>
							{(btn) => (
								<button
									type="button"
									aria-label={btn.label}
									aria-pressed={active().includes(btn.command)}
									disabled={local.disabled}
									onClick={() => local.onAction?.(btn.command)}
									class={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
										active().includes(btn.command)
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted hover:text-foreground"
									}`}
								>
									{btn.icon}
								</button>
							)}
						</For>
					</>
				)}
			</For>
		</div>
	);
}
