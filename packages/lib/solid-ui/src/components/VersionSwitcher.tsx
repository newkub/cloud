/**
 * VersionSwitcher - dropdown listing doc/package versions. Prop-driven
 * version of create-docs' VersionDropdown — supply versions or an async
 * loader (e.g. git tags); selecting an item navigates to `url` or calls
 * `onVersionChange`.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, onMount, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface VersionItem {
	id: string;
	label: string;
	url?: string;
	/** Kind tag rendered small next to the label. */
	kind?: "version" | "tag" | "branch" | "commit";
}

export interface VersionSwitcherProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Static version list. */
	versions?: VersionItem[];
	/** Async loader used when `versions` is not provided. Failures are ignored. */
	load?: () => Promise<VersionItem[]>;
	/** Currently selected id or label. */
	current?: string;
	onVersionChange?: (item: VersionItem) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function VersionSwitcher(props: VersionSwitcherProps) {
	const [local, rest] = splitProps(props, ["class", "versions", "load", "current", "onVersionChange", "radius"]);
	const [open, setOpen] = createSignal(false);
	const [loaded, setLoaded] = createSignal<VersionItem[] | null>(null);
	let rootEl: HTMLDivElement | undefined;

	onMount(async () => {
		if (local.versions || !local.load) return;
		setLoaded(await local.load().catch(() => []));
	});

	useClickOutside(
		() => rootEl,
		() => setOpen(false),
		{ events: ["pointerdown"] },
	);
	useEscapeKey(() => setOpen(false));

	const items = () => local.versions ?? loaded() ?? [];
	const currentLabel = () =>
		items().find((v) => v.id === local.current || v.label === local.current)?.label ?? local.current ?? "version";

	const pick = (item: VersionItem) => {
		setOpen(false);
		if (local.onVersionChange) local.onVersionChange(item);
		else if (item.url) window.location.href = item.url;
	};

	return (
		<div ref={rootEl} class={`solidui-version-switcher relative inline-block ${local.class ?? ""}`.trim()} {...rest}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="listbox"
				aria-expanded={open()}
				class={`inline-flex items-center gap-1.5 h-8 px-3 border border-border bg-surface text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10l-5 8z" />
					<circle cx="12" cy="12" r="9" />
				</svg>
				<span class="max-w-40 truncate">{currentLabel()}</span>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class={`h-3 w-3 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
				</svg>
			</button>
			<Show when={open()}>
				<div
					role="listbox"
					aria-label="Versions"
					class={`absolute left-0 top-full mt-1 z-dropdown min-w-48 max-h-64 overflow-y-auto border border-border bg-surface p-1 shadow-lg ${radiusMap[local.radius ?? "md"]}`}
				>
					<For each={items()} fallback={<p class="px-3 py-2 text-xs text-muted-foreground m-0">No versions</p>}>
						{(item) => (
							<button
								type="button"
								role="option"
								aria-selected={item.id === local.current || item.label === currentLabel()}
								onClick={() => pick(item)}
								class={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-left cursor-pointer border-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
									item.id === local.current || item.label === currentLabel()
										? "bg-primary/10 text-primary font-medium"
										: "bg-transparent text-foreground hover:bg-muted"
								}`}
							>
								<span class="flex-1 truncate">{item.label}</span>
								<Show when={item.kind}>
									<span class="text-2xs text-muted-foreground shrink-0">{item.kind}</span>
								</Show>
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
