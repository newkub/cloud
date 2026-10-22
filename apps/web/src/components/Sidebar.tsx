import { Link } from "@tanstack/solid-router";
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

export function Sidebar() {
	const [collapsed, setCollapsed] = createSignal(
		localStorage.getItem(COLLAPSED_KEY) === "1",
	);
	const [query, setQuery] = createSignal("");
	const [closed, setClosed] = createSignal<Record<string, boolean>>(
		storedGroups(),
	);
	let searchRef: HTMLInputElement | undefined;

	const groups = createMemo(() => {
		const q = query().trim().toLowerCase();
		return productGroups
			.map((group) => ({
				...group,
				items: products.filter(
					(p) =>
						p.group === group.key &&
						(!q ||
							p.name.toLowerCase().includes(q) ||
							p.description.toLowerCase().includes(q)),
				),
			}))
			.filter((group) => group.items.length > 0);
	});

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

	function onKeydown(e: KeyboardEvent) {
		const el = document.activeElement;
		const typing =
			el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
		if (e.key === "/" && !typing) {
			e.preventDefault();
			searchRef?.focus();
		} else if (e.key === "Escape" && typing) {
			setQuery("");
			(el as HTMLElement).blur();
		}
	}

	onMount(() => document.addEventListener("keydown", onKeydown));
	onCleanup(() => document.removeEventListener("keydown", onKeydown));

	return (
		<aside
			class={`flex h-screen shrink-0 flex-col border-r border-edge bg-panel ${
				collapsed() ? "w-[68px]" : "w-64"
			}`}
		>
			<Link
				to="/"
				title="Wrikka Cloud"
				class="flex h-14 shrink-0 items-center gap-2.5 border-b border-edge px-4"
			>
				<span class="i-mdi:cloud-outline shrink-0 text-2xl text-acc" />
				<Show when={!collapsed()}>
					<span class="truncate text-sm font-semibold tracking-tight">
						Wrikka Cloud
					</span>
				</Show>
			</Link>

			<Show when={!collapsed()}>
				<div class="shrink-0 border-b border-edge px-3 py-3">
					<label class="flex items-center gap-2 rounded-lg border border-edge bg-ink px-2.5 py-1.5 text-sm text-dim focus-within:border-acc/50">
						<span class="i-mdi:magnify shrink-0 text-faint" />
						<input
							ref={searchRef}
							type="text"
							value={query()}
							onInput={(e) => setQuery(e.currentTarget.value)}
							placeholder="Search products"
							aria-label="Search products"
							class="w-full bg-transparent text-fg outline-none placeholder:text-faint"
						/>
						<kbd>/</kbd>
					</label>
				</div>
			</Show>

			<nav class="flex-1 overflow-y-auto px-2 py-2">
				<For each={groups()}>
					{(group) => (
						<section class="mb-1">
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
									<span class="ml-auto tabular-nums">{group.items.length}</span>
								</button>
							</Show>
							<Show when={collapsed() || !closed()[group.key]}>
								<For each={group.items}>
									{(product) => (
										<NavItem product={product} collapsed={collapsed()} />
									)}
								</For>
							</Show>
						</section>
					)}
				</For>
				<Show when={query().trim() && groups().length === 0}>
					<p class="px-2 py-6 text-center text-sm text-faint">
						No products match “{query().trim()}”
					</p>
				</Show>
			</nav>

			<div class="flex shrink-0 items-center gap-2 border-t border-edge px-3 py-2.5">
				<button
					type="button"
					onClick={toggleCollapsed}
					title={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
					aria-label={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
					class="flex h-7 w-7 items-center justify-center rounded-md text-dim hover:bg-raise hover:text-fg"
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
				</Show>
			</div>
		</aside>
	);
}

function NavItem(props: { product: Product; collapsed: boolean }) {
	return (
		<Link
			to="/products/$slug"
			params={{ slug: props.product.key }}
			title={`${props.product.name} — ${props.product.description}`}
			activeOptions={{ exact: true }}
			activeProps={{ class: "bg-acc/10 text-acc" }}
			class={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-dim hover:bg-raise hover:text-fg ${
				props.collapsed ? "justify-center" : ""
			}`}
		>
			<span
				class={`${props.product.icon} shrink-0 text-lg ${
					isAvailable(props.product) ? "text-acc" : "text-faint"
				}`}
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
