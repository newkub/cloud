import { useLocation, useNavigate } from "@tanstack/solid-router";
import {
	createEffect,
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { queryClient } from "../ci/api";
import { isAvailable, products } from "../data/products";
import { loadPrefs, savePrefs } from "../lib/theme";
import {
	APP_TABS,
	type AppContext,
	type AppTabId,
	appContextForPath,
} from "./apps";

interface PaletteEntry {
	id: string;
	label: string;
	hint?: string;
	icon: string;
	run: () => void;
}

interface PaletteGroup {
	label: string;
	entries: PaletteEntry[];
}

const OPEN_EVENT = "cloud:open-palette";

export function openCommandPalette() {
	window.dispatchEvent(new Event(OPEN_EVENT));
}

export function GlobalCommandPalette() {
	const navigate = useNavigate();
	const pathname = useLocation({ select: (location) => location.pathname });
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal("");
	const [active, setActive] = createSignal(0);
	let inputRef: HTMLInputElement | undefined;

	const context = createMemo<AppContext>(() => appContextForPath(pathname()));

	function close() {
		setOpen(false);
		setQuery("");
		setActive(0);
	}

	function run(action: () => void) {
		close();
		action();
	}

	function goAppTab(id: AppTabId) {
		const ctx = context();
		if (ctx.kind === "cloud") {
			if (id === "docs") navigate({ to: "/docs" });
			else if (id === "settings") navigate({ to: "/settings" });
			else if (id === "logs") navigate({ to: "/logs" });
			else navigate({ to: "/" });
			return;
		}
		if (ctx.kind === "ci") {
			if (id === "docs") navigate({ to: "/ci/docs" });
			else if (id === "settings") navigate({ to: "/ci/settings" });
			else if (id === "logs") navigate({ to: "/ci/logs" });
			else navigate({ to: "/ci" });
			return;
		}
		if (id === "docs")
			navigate({ to: "/products/$slug/docs", params: { slug: ctx.slug } });
		else if (id === "settings")
			navigate({ to: "/products/$slug/settings", params: { slug: ctx.slug } });
		else if (id === "logs")
			navigate({ to: "/products/$slug/logs", params: { slug: ctx.slug } });
		else navigate({ to: "/products/$slug", params: { slug: ctx.slug } });
	}

	const groups = createMemo<PaletteGroup[]>(() => {
		const ctx = context();
		const appName =
			ctx.kind === "cloud"
				? "Cloud"
				: ctx.kind === "ci"
					? "CI"
					: (products.find((product) => product.key === ctx.slug)?.name ??
						"App");

		const appEntries: PaletteEntry[] = APP_TABS.map((tab) => ({
			id: `tab:${tab.id}`,
			label: `${appName} · ${tab.label}`,
			hint: "Go to tab",
			icon: tab.icon,
			run: () => goAppTab(tab.id),
		}));

		const appEntriesAll: PaletteEntry[] = [
			{
				id: "app:cloud",
				label: "Cloud",
				hint: "Workspace overview",
				icon: "i-mdi:cloud-outline",
				run: () => navigate({ to: "/" }),
			},
			...products
				.filter((product) => ctx.kind !== "product" || product.key !== ctx.slug)
				.map((product) => ({
					id: `app:${product.key}`,
					label: product.name,
					hint: isAvailable(product) ? product.description : "Coming soon",
					icon: product.icon,
					run: () => {
						if (product.key === "ci") navigate({ to: "/ci" });
						else
							navigate({
								to: "/products/$slug",
								params: { slug: product.key },
							});
					},
				})),
		];

		const actionEntries: PaletteEntry[] = [
			{
				id: "action:theme",
				label: "Toggle light / dark theme",
				icon: "i-mdi:theme-light-dark",
				run: () => {
					const prefs = loadPrefs();
					savePrefs({
						...prefs,
						mode: prefs.mode === "dark" ? "light" : "dark",
					});
				},
			},
			{
				id: "action:motion",
				label: "Toggle reduced motion",
				icon: "i-mdi:motion-pause-outline",
				run: () => {
					const prefs = loadPrefs();
					savePrefs({ ...prefs, reducedMotion: !prefs.reducedMotion });
				},
			},
			{
				id: "action:refresh",
				label: "Refresh workspace data",
				hint: "Re-fetch queries",
				icon: "i-mdi:refresh",
				run: () => {
					void queryClient.invalidateQueries();
				},
			},
			{
				id: "action:sidebar",
				label: "Toggle sidebar",
				hint: "Collapse or expand",
				icon: "i-mdi:page-layout-sidebar-left",
				run: () => window.dispatchEvent(new Event("cloud:sidebar:toggle")),
			},
			{
				id: "action:apps",
				label: "Browse all apps",
				icon: "i-mdi:grid",
				run: () => navigate({ to: "/products" }),
			},
		];

		return [
			{ label: "This app", entries: appEntries },
			{ label: "Apps", entries: appEntriesAll },
			{ label: "Actions", entries: actionEntries },
		];
	});

	const filtered = createMemo<PaletteGroup[]>(() => {
		const q = query().trim().toLowerCase();
		if (!q) {
			return groups();
		}
		return groups()
			.map((group) => ({
				...group,
				entries: group.entries.filter(
					(entry) =>
						entry.label.toLowerCase().includes(q) ||
						entry.hint?.toLowerCase().includes(q) === true,
				),
			}))
			.filter((group) => group.entries.length > 0);
	});

	const flat = createMemo(() => filtered().flatMap((group) => group.entries));

	const rendered = createMemo(() => {
		let offset = 0;
		return filtered().map((group) => {
			const start = offset;
			offset += group.entries.length;
			return { ...group, start };
		});
	});

	createEffect(() => {
		if (open()) {
			queueMicrotask(() => inputRef?.focus());
		}
	});

	function onKeydown(event: KeyboardEvent) {
		const target = event.target;
		const typing =
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			(target instanceof HTMLElement && target.isContentEditable);

		if (open()) {
			if (event.key === "Escape") {
				event.preventDefault();
				close();
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				setActive((index) => Math.min(index + 1, flat().length - 1));
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setActive((index) => Math.max(index - 1, 0));
			} else if (event.key === "Enter") {
				event.preventDefault();
				const entry = flat()[active()];
				if (entry) {
					run(entry.run);
				}
			}
			return;
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
			event.preventDefault();
			setOpen(true);
		} else if (event.key === "/" && !typing) {
			event.preventDefault();
			setOpen(true);
		}
	}

	function onOpenEvent() {
		setOpen(true);
	}

	onMount(() => {
		document.addEventListener("keydown", onKeydown);
		window.addEventListener(OPEN_EVENT, onOpenEvent);
	});
	onCleanup(() => {
		document.removeEventListener("keydown", onKeydown);
		window.removeEventListener(OPEN_EVENT, onOpenEvent);
	});

	return (
		<Show when={open()}>
			<div class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm">
				<button
					type="button"
					aria-label="Close command palette"
					onClick={close}
					class="absolute inset-0 cursor-default"
				/>
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Command palette"
					class="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-edge bg-panel shadow-2xl"
				>
					<label class="flex shrink-0 items-center gap-2.5 border-b border-edge px-4 py-3">
						<span class="i-mdi:magnify text-lg text-faint" />
						<input
							ref={inputRef}
							type="text"
							value={query()}
							onInput={(event) => {
								setQuery(event.currentTarget.value);
								setActive(0);
							}}
							placeholder="Search apps, tabs and actions…"
							aria-label="Search commands"
							class="w-full bg-transparent text-sm text-fg outline-none placeholder:text-faint"
						/>
						<kbd class="rounded border border-edge bg-ink px-1.5 py-0.5 font-mono text-[10px] text-faint">
							esc
						</kbd>
					</label>
					<div class="min-h-0 flex-1 overflow-y-auto p-2">
						<Show
							when={flat().length > 0}
							fallback={
								<p class="px-3 py-8 text-center text-sm text-faint">
									No matches for “{query().trim()}”
								</p>
							}
						>
							<For each={rendered()}>
								{(group) => (
									<div class="mb-1">
										<p class="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">
											{group.label}
										</p>
										<For each={group.entries}>
											{(entry, index) => (
												<button
													type="button"
													onClick={() => run(entry.run)}
													onMouseEnter={() => setActive(group.start + index())}
													class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
														active() === group.start + index()
															? "bg-acc/10 text-acc"
															: "text-dim hover:bg-raise hover:text-fg"
													}`}
												>
													<span class={`${entry.icon} shrink-0 text-lg`} />
													<span class="min-w-0 flex-1">
														<span class="block truncate">{entry.label}</span>
														<Show when={entry.hint}>
															<span class="block truncate text-xs text-faint">
																{entry.hint}
															</span>
														</Show>
													</span>
													<span class="i-mdi:chevron-right text-base text-faint" />
												</button>
											)}
										</For>
									</div>
								)}
							</For>
						</Show>
					</div>
					<div class="flex shrink-0 items-center gap-3 border-t border-edge px-4 py-2 text-[11px] text-faint">
						<span class="flex items-center gap-1">
							<kbd class="rounded border border-edge bg-ink px-1 font-mono">
								↑
							</kbd>
							<kbd class="rounded border border-edge bg-ink px-1 font-mono">
								↓
							</kbd>
							navigate
						</span>
						<span class="flex items-center gap-1">
							<kbd class="rounded border border-edge bg-ink px-1 font-mono">
								↵
							</kbd>
							open
						</span>
						<span class="ml-auto flex items-center gap-1">
							<kbd class="rounded border border-edge bg-ink px-1 font-mono">
								⌘K
							</kbd>
							anywhere
						</span>
					</div>
				</div>
			</div>
		</Show>
	);
}
