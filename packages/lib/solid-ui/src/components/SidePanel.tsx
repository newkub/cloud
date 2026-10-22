/**
 * SidePanel — collapsible side panel that shrinks to an icon rail and expands to labeled items; optionally resizable.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface SidePanelItem {
	/** Icon (JSX or glyph) — the only thing visible when collapsed. */
	icon: JSX.Element;
	/** Item label. */
	label: string;
	/** Link target — renders an anchor when provided. */
	href?: string;
}

export interface SidePanelProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onToggle"> {
	/** Panel items. */
	items: SidePanelItem[];
	/** Whether the panel is expanded (labeled) or collapsed to the icon rail. */
	expanded?: boolean;
	/** Called with the next expanded state when the toggle is clicked. */
	onToggle?: (expanded: boolean) => void;
	/** Currently active item label — gets `aria-current` and highlight. */
	value?: string;
	/** Allow horizontal resizing while expanded. @default false */
	resizable?: boolean;
	/** Panel accessible name. @default "Side panel" */
	"aria-label"?: string;
	/** Extra content pinned to the bottom of the panel. */
	footer?: JSX.Element;
}

export function SidePanel(props: SidePanelProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"expanded",
		"onToggle",
		"value",
		"resizable",
		"aria-label",
		"footer",
	]);
	const expanded = () => local.expanded ?? false;

	const rowCls = (active: boolean) =>
		`flex w-full items-center gap-2 rounded-md py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
			expanded() ? "px-3" : "justify-center px-2"
		} ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;

	return (
		<nav
			aria-label={local["aria-label"] ?? "Side panel"}
			class={`solidui-side-panel flex h-full flex-col border-r border-border bg-background transition-[width] motion-reduce:transition-none ${
				expanded() ? "w-56" : "w-14"
			} ${expanded() && (local.resizable ?? false) ? "resize-x overflow-auto" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`flex p-2 ${expanded() ? "justify-end" : "justify-center"}`}>
				<button
					type="button"
					class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-label={expanded() ? "Collapse panel" : "Expand panel"}
					aria-expanded={expanded()}
					onClick={() => local.onToggle?.(!expanded())}
				>
					<svg
						class={`h-4 w-4 transition-transform motion-reduce:transition-none ${expanded() ? "rotate-180" : ""}`}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="m9 6 6 6-6 6" />
					</svg>
				</button>
			</div>
			<ul class="flex-1 space-y-0.5 overflow-y-auto p-2">
				<For each={local.items ?? []}>
					{(item) => {
						const active = () => item.label === local.value;
						const body = (
							<>
								<span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
									{item.icon}
								</span>
								<Show when={expanded()}>
									<span class="min-w-0 flex-1 truncate text-left">{item.label}</span>
								</Show>
							</>
						);
						return (
							<li>
								{item.href ? (
									<a
										href={item.href}
										class={rowCls(active())}
										aria-current={active() ? "page" : undefined}
										title={expanded() ? undefined : item.label}
									>
										{body}
									</a>
								) : (
									<button type="button" class={rowCls(active())} title={expanded() ? undefined : item.label}>
										{body}
									</button>
								)}
							</li>
						);
					}}
				</For>
			</ul>
			<Show when={local.footer}>
				<div class="border-t border-border p-3">{local.footer}</div>
			</Show>
		</nav>
	);
}
