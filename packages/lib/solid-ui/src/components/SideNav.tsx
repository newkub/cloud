/**
 * SideNav — collapsible vertical navigation with icons, badges, nested items, and a footer slot.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface SideNavItem {
	/** Item label. */
	label: string;
	/** Link target — renders an anchor when provided. */
	href?: string;
	/** Icon rendered before the label (the only thing visible when collapsed). */
	icon?: JSX.Element;
	/** Small badge at the row end. */
	badge?: string | number;
	/** Nested items — expandable when the nav is not collapsed. */
	children?: SideNavItem[];
}

export interface SideNavProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Navigation tree. */
	items: SideNavItem[];
	/** Collapse to an icon-only rail. */
	collapsed?: boolean;
	/** Show a collapse/expand toggle button. */
	collapsible?: boolean;
	/** Current path — matching `href` gets `aria-current="page"`. */
	activePath?: string;
	/** Called with the clicked item. */
	onNavigate?: (item: SideNavItem) => void;
	/** Slot pinned to the bottom (user card, logout, …). */
	footer?: JSX.Element;
	/** Surface treatment. @default "default" */
	variant?: SurfaceVariant;
}

export function SideNav(props: SideNavProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"collapsed",
		"collapsible",
		"activePath",
		"onNavigate",
		"footer",
		"variant",
	]);
	const [manual, setManual] = createSignal<boolean>();
	const collapsed = () => manual() ?? local.collapsed ?? false;
	const [expandedMap, setExpandedMap] = createSignal<Record<string, boolean>>({});
	const toggleExpanded = (key: string) => setExpandedMap((m) => ({ ...m, [key]: !m[key] }));

	const rowCls = (active?: boolean) =>
		`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
			active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
		}`;

	const itemIcon = (item: SideNavItem) => (
		<Show when={item.icon}>
			<span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
				{item.icon}
			</span>
		</Show>
	);
	const itemLabel = (item: SideNavItem) => (
		<Show when={!collapsed()}>
			<span class="min-w-0 flex-1 truncate text-left">{item.label}</span>
		</Show>
	);
	const itemBadge = (item: SideNavItem) => (
		<Show when={!collapsed() && item.badge !== undefined}>
			<span class="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{item.badge}</span>
		</Show>
	);
	const chevron = (open: boolean) => (
		<svg
			class={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);

	const renderItem = (item: SideNavItem, key: string): JSX.Element => {
		const active = () => item.href !== undefined && item.href === local.activePath;
		const hasKids = () => !collapsed() && (item.children?.length ?? 0) > 0;
		const expanded = () => expandedMap()[key] ?? false;
		const navigate = () => local.onNavigate?.(item);

		return (
			<li>
				{hasKids() ? (
					<button
						type="button"
						class={rowCls(active())}
						aria-expanded={expanded()}
						onClick={() => {
							toggleExpanded(key);
							navigate();
						}}
					>
						{itemIcon(item)}
						{itemLabel(item)}
						{itemBadge(item)}
						{chevron(expanded())}
					</button>
				) : item.href ? (
					<a
						href={item.href}
						class={`${rowCls(active())} ${collapsed() ? "justify-center px-2" : ""}`}
						aria-current={active() ? "page" : undefined}
						title={collapsed() ? item.label : undefined}
						onClick={navigate}
					>
						{itemIcon(item)}
						{itemLabel(item)}
						{itemBadge(item)}
					</a>
				) : (
					<button
						type="button"
						class={`${rowCls()} ${collapsed() ? "justify-center px-2" : ""}`}
						title={collapsed() ? item.label : undefined}
						onClick={navigate}
					>
						{itemIcon(item)}
						{itemLabel(item)}
						{itemBadge(item)}
					</button>
				)}
				<Show when={hasKids() && expanded()}>
					<ul class="mt-0.5 space-y-0.5 border-l border-border pl-2">
						<For each={item.children}>{(child, i) => renderItem(child, `${key}.${i()}`)}</For>
					</ul>
				</Show>
			</li>
		);
	};

	return (
		<nav
			aria-label="Sidebar"
			class={`solidui-side-nav flex h-full flex-col border ${surfaceVariants[local.variant ?? "default"]} ${collapsed() ? "w-16" : "w-64"} transition-[width] motion-reduce:transition-none ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.collapsible}>
				<div class={`flex p-2 ${collapsed() ? "justify-center" : "justify-end"}`}>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						aria-label={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
						aria-expanded={!collapsed()}
						onClick={() => setManual(!collapsed())}
					>
						<svg
							class={`h-4 w-4 transition-transform motion-reduce:transition-none ${collapsed() ? "rotate-180" : ""}`}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<path d="m15 6-6 6 6 6" />
						</svg>
					</button>
				</div>
			</Show>
			<ul class="flex-1 space-y-0.5 overflow-y-auto p-2">
				<For each={local.items}>{(item, i) => renderItem(item, `${i()}`)}</For>
			</ul>
			<Show when={local.footer}>
				<div class="border-t border-border p-3">{local.footer}</div>
			</Show>
		</nav>
	);
}
