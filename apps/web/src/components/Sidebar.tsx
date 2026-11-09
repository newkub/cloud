import { Link, useLocation } from "@tanstack/solid-router";
import {
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import {
	isAvailable,
	type Product,
	productGroups,
	products,
} from "../data/products";
import { openCommandPalette } from "../shell/CommandPalette";
import { StatusBadge } from "./StatusBadge";

const COLLAPSED_KEY = "cloud:sidebar:collapsed";
const GROUPS_KEY = "cloud:sidebar:groups";

function storedGroups(): Record<string, boolean> {
	try {
		return JSON.parse(localStorage.getItem(GROUPS_KEY) ?? "{}") as Record<
			string,
			boolean
		>;
	} catch {
		return {};
	}
}

export function Sidebar(props: { mobileOpen: boolean; onClose: () => void }) {
	const [collapsed, setCollapsed] = createSignal(
		localStorage.getItem(COLLAPSED_KEY) === "1",
	);
	const [closed, setClosed] = createSignal<Record<string, boolean>>(
		storedGroups(),
	);
	const pathname = useLocation({ select: (location) => location.pathname });

	const groups = createMemo(() =>
		productGroups
			.map((group) => ({
				...group,
				items: products.filter((product) => product.group === group.key),
			}))
			.filter((group) => group.items.length > 0),
	);

	const cloudActive = () => {
		const path = pathname();
		return ["/", "/docs", "/settings", "/logs"].includes(path);
	};
	const catalogActive = () => pathname() === "/products";

	function productActive(key: string): boolean {
		const path = pathname();
		if (key === "ci") {
			return path === "/ci" || path.startsWith("/ci/");
		}
		return path === `/products/${key}` || path.startsWith(`/products/${key}/`);
	}

	function toggleCollapsed() {
		const next = !collapsed();
		setCollapsed(next);
		localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
	}

	function toggleGroup(key: string) {
		const next = { ...closed(), [key]: !closed()[key] };
		setClosed(next);
		localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
	}

	function onToggleEvent() {
		toggleCollapsed();
	}

	onMount(() => window.addEventListener("cloud:sidebar:toggle", onToggleEvent));
	onCleanup(() =>
		window.removeEventListener("cloud:sidebar:toggle", onToggleEvent),
	);

	return (
		<>
			<Show when={props.mobileOpen}>
				<button
					type="button"
					aria-label="Close navigation"
					onClick={props.onClose}
					class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
				/>
			</Show>
			<aside
				class={`fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 flex-col border-r border-edge bg-panel transition-transform lg:static lg:translate-x-0 ${
					collapsed() ? "w-[76px]" : "w-64"
				} ${props.mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div class="flex h-14 shrink-0 items-center border-b border-edge">
					<Link
						to="/"
						title="Wrikka Cloud"
						onClick={props.onClose}
						class={`flex min-w-0 flex-1 items-center gap-2.5 ${
							collapsed() ? "justify-center px-2" : "px-4"
						}`}
					>
						<span class="i-mdi:cloud-outline shrink-0 text-2xl text-acc" />
						<Show when={!collapsed()}>
							<span class="truncate text-sm font-semibold tracking-tight">
								Wrikka Cloud
							</span>
						</Show>
					</Link>
					<button
						type="button"
						onClick={props.onClose}
						title="Close navigation"
						aria-label="Close navigation"
						class="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-dim hover:bg-raise hover:text-fg lg:hidden"
					>
						<span class="i-mdi:close text-lg" />
					</button>
				</div>

				<div class={`shrink-0 ${collapsed() ? "px-2 py-2" : "px-3 py-3"}`}>
					<button
						type="button"
						onClick={openCommandPalette}
						title="Search or jump to… (⌘K)"
						class={`flex w-full items-center gap-2 rounded-lg border border-edge bg-ink text-sm text-dim hover:border-acc/40 hover:text-fg ${
							collapsed() ? "justify-center px-0 py-2" : "px-2.5 py-1.5"
						}`}
					>
						<span class="i-mdi:magnify shrink-0 text-faint" />
						<Show when={!collapsed()}>
							<span class="flex-1 text-left text-faint">
								Search or jump to…
							</span>
							<kbd class="rounded border border-edge px-1 font-mono text-[10px] text-faint">
								⌘K
							</kbd>
						</Show>
					</button>
				</div>

				<nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
					<AppLink
						active={cloudActive()}
						collapsed={collapsed()}
						icon="i-mdi:cloud-outline"
						name="Cloud"
						onNavigate={props.onClose}
					/>
					<AppLink
						active={catalogActive()}
						collapsed={collapsed()}
						icon="i-mdi:grid"
						name="All apps"
						onNavigate={props.onClose}
					/>

					<For each={groups()}>
						{(group) => (
							<section class="mt-1">
								<Show
									when={!collapsed()}
									fallback={<div class="mx-3 my-2 h-px bg-edge" />}
								>
									<button
										type="button"
										onClick={() => toggleGroup(group.key)}
										aria-expanded={!closed()[group.key]}
										class="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-faint hover:text-dim"
									>
										<span
											class={`text-sm transition-transform ${
												closed()[group.key]
													? "i-mdi:chevron-right"
													: "i-mdi:chevron-down"
											}`}
										/>
										<span class="truncate">{group.label}</span>
										<span class="ml-auto tabular-nums">
											{group.items.length}
										</span>
									</button>
								</Show>
								<Show when={collapsed() || !closed()[group.key]}>
									<For each={group.items}>
										{(product) => (
											<ProductLink
												product={product}
												active={productActive(product.key)}
												collapsed={collapsed()}
												onNavigate={props.onClose}
											/>
										)}
									</For>
								</Show>
							</section>
						)}
					</For>
				</nav>

				<div
					class={`flex shrink-0 items-center gap-2 border-t border-edge py-2.5 ${
						collapsed() ? "justify-center px-2" : "px-3"
					}`}
				>
					<button
						type="button"
						onClick={toggleCollapsed}
						title={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
						aria-label={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-dim hover:bg-raise hover:text-fg"
					>
						<span
							class={
								collapsed()
									? "i-mdi:chevron-double-right"
									: "i-mdi:chevron-double-left"
							}
						/>
					</button>
					<Show when={!collapsed()}>
						<span class="text-xs text-faint">v0.1.0</span>
						<span class="ml-auto flex items-center gap-1.5 text-[11px] text-faint">
							<span class="i-mdi:circle h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acc" />
							local
						</span>
					</Show>
				</div>
			</aside>
		</>
	);
}

function AppLink(props: {
	active: boolean;
	collapsed: boolean;
	icon: string;
	name: string;
	onNavigate: () => void;
}) {
	return (
		<Link
			to={props.name === "Cloud" ? "/" : "/products"}
			onClick={props.onNavigate}
			title={props.name}
			aria-label={props.name}
			aria-current={props.active ? "page" : undefined}
			class={itemClass(props.collapsed, props.active)}
		>
			<span class={`${props.icon} shrink-0 text-lg`} />
			<Show when={!props.collapsed}>
				<span class="truncate">{props.name}</span>
			</Show>
		</Link>
	);
}

function ProductLink(props: {
	product: Product;
	active: boolean;
	collapsed: boolean;
	onNavigate: () => void;
}) {
	const live = () => isAvailable(props.product);

	if (props.product.key === "ci") {
		return (
			<Link
				to="/ci"
				onClick={props.onNavigate}
				title={`${props.product.name} — ${props.product.description}`}
				aria-label={props.product.name}
				aria-current={props.active ? "page" : undefined}
				class={itemClass(props.collapsed, props.active)}
			>
				<span
					class={`${props.product.icon} shrink-0 text-lg ${live() ? "text-acc" : "text-faint"}`}
				/>
				<Show when={!props.collapsed}>
					<span class="truncate">{props.product.name}</span>
					<span class="ml-auto">
						<StatusBadge status={props.product.status} />
					</span>
				</Show>
			</Link>
		);
	}

	return (
		<Link
			to="/products/$slug"
			params={{ slug: props.product.key }}
			onClick={props.onNavigate}
			title={`${props.product.name} — ${props.product.description}`}
			aria-label={props.product.name}
			aria-current={props.active ? "page" : undefined}
			class={itemClass(props.collapsed, props.active)}
		>
			<span
				class={`${props.product.icon} shrink-0 text-lg ${live() ? "text-acc" : "text-faint"}`}
			/>
			<Show when={!props.collapsed}>
				<span class="truncate">{props.product.name}</span>
				<span class="ml-auto">
					<StatusBadge status={props.product.status} />
				</span>
			</Show>
		</Link>
	);
}

function itemClass(collapsed: boolean, active: boolean): string {
	const base = collapsed
		? "mb-0.5 flex h-9 items-center justify-center rounded-lg text-dim hover:bg-raise hover:text-fg"
		: "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-dim hover:bg-raise hover:text-fg";
	return `${base} ${active ? "bg-acc/10 text-acc" : ""}`;
}
