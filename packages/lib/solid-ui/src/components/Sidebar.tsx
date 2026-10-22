/**
 * Sidebar - collapsible app sidebar with header, scrollable body and footer.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";

export interface SidebarProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Collapsed to icon-rail width. */
	collapsed?: boolean;
	/** Called when the collapse toggle is pressed. */
	onCollapsedChange?: (collapsed: boolean) => void;
	/** Header slot — brand/logo. */
	header?: JSX.Element;
	/** Footer slot — user card, settings. */
	footer?: JSX.Element;
	/** Show the built-in collapse toggle button. @default true */
	collapsible?: boolean;
	/** Expanded width in px. @default 240 */
	width?: number;
	/** Collapsed width in px. @default 56 */
	collapsedWidth?: number;
}

export function Sidebar(props: SidebarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"collapsed",
		"onCollapsedChange",
		"header",
		"footer",
		"collapsible",
		"width",
		"collapsedWidth",
		"children",
	]);
	const [internal, setInternal] = createSignal(false);

	const collapsed = () => local.collapsed ?? internal();
	const toggle = () => {
		const next = !collapsed();
		setInternal(next);
		local.onCollapsedChange?.(next);
	};

	const className = () =>
		[
			"solidui-sidebar flex h-full flex-col border-r border-border bg-surface transition-[width] duration-200 motion-reduce:transition-none overflow-hidden",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<aside
			class={className()}
			style={{ width: `${collapsed() ? (local.collapsedWidth ?? 56) : (local.width ?? 240)}px` }}
			{...rest}
		>
			<Show when={local.header}>
				<div class="flex h-14 items-center gap-2 border-b border-border px-3 shrink-0">{local.header}</div>
			</Show>
			<nav class="flex-1 overflow-y-auto p-2 space-y-1" aria-label="Sidebar">
				{local.children}
			</nav>
			<div class="border-t border-border p-2 shrink-0 flex items-center gap-2">
				{local.footer}
				<Show when={local.collapsible ?? true}>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
						aria-expanded={!collapsed()}
						onClick={toggle}
					>
						<NamedIcon name="menu" class="h-4 w-4" />
					</button>
				</Show>
			</div>
		</aside>
	);
}
