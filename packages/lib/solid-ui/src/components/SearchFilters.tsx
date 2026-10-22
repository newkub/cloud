/**
 * SearchFilters — collapsible facet groups with checkbox counts and a clear-all chip.
 */
import { createMemo, createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";

export interface SearchFacetOption {
	value: string;
	count: number;
}

export interface SearchFacet {
	label: string;
	options: SearchFacetOption[];
}

export type SearchFiltersValue = Record<string, string[]>;

export interface SearchFiltersProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Facet groups to render. */
	facets: SearchFacet[];
	/** Controlled selection — maps facet label to selected option values. */
	value?: SearchFiltersValue;
	/** Called with the next selection map whenever a checkbox toggles or all filters are cleared. */
	onChange?: (value: SearchFiltersValue) => void;
}

export function SearchFilters(props: SearchFiltersProps) {
	const [local, rest] = splitProps(props, ["class", "facets", "value", "onChange"]);
	const id = `solidui-search-filters-${createUniqueId()}`;
	const [internal, setInternal] = createSignal<SearchFiltersValue>({});
	const [collapsed, setCollapsed] = createSignal<Record<string, boolean>>({});
	const selection = () => local.value ?? internal();

	const activeCount = createMemo(() => Object.values(selection()).reduce((sum, list) => sum + list.length, 0));

	const isChecked = (facet: string, option: string) => selection()[facet]?.includes(option) ?? false;

	const toggleOption = (facet: string, option: string) => {
		const next: SearchFiltersValue = {};
		for (const [key, list] of Object.entries(selection())) next[key] = [...list];
		const list = next[facet] ?? [];
		next[facet] = list.includes(option) ? list.filter((v) => v !== option) : [...list, option];
		if (next[facet].length === 0) delete next[facet];
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	const clearAll = () => {
		const next: SearchFiltersValue = {};
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	const toggleGroup = (label: string) => setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

	return (
		<div
			class={`solidui-search-filters flex flex-col gap-2 rounded-lg border border-border bg-card p-3 ${local.class ?? ""}`}
			{...rest}
		>
			<div class="flex items-center justify-between">
				<span class="flex items-center gap-2 text-sm font-medium text-foreground">
					Filters
					<Show when={activeCount() > 0}>
						<span class="rounded-full bg-primary px-2 py-0.5 text-2xs font-semibold text-primary-foreground">
							{activeCount()}
						</span>
					</Show>
				</span>
				<Show when={activeCount() > 0}>
					<button
						type="button"
						class="rounded-full border border-border bg-muted px-2.5 py-0.5 text-2xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						onClick={clearAll}
					>
						Clear all
					</button>
				</Show>
			</div>
			<For each={local.facets}>
				{(facet, fi) => (
					<div class="border-t border-border pt-2 first:border-t-0 first:pt-0">
						<button
							type="button"
							class="flex w-full items-center justify-between rounded-sm py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={() => toggleGroup(facet.label)}
							aria-expanded={!collapsed()[facet.label]}
						>
							{facet.label}
							<svg
								class={`h-4 w-4 text-muted-foreground transition-transform motion-reduce:transition-none ${collapsed()[facet.label] ? "" : "rotate-180"}`}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</button>
						<Show when={!collapsed()[facet.label]}>
							<ul class="mt-1 flex flex-col gap-1">
								<For each={facet.options}>
									{(option, oi) => {
										const optionId = `${id}-${fi()}-${oi()}`;
										return (
											<li>
												<label
													for={optionId}
													class="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-0.5 text-sm text-foreground hover:bg-muted"
												>
													<input
														id={optionId}
														type="checkbox"
														class="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
														checked={isChecked(facet.label, option.value)}
														onChange={() => toggleOption(facet.label, option.value)}
													/>
													<span class="flex-1">{option.value}</span>
													<span class="text-xs tabular-nums text-muted-foreground">{option.count}</span>
												</label>
											</li>
										);
									}}
								</For>
							</ul>
						</Show>
					</div>
				)}
			</For>
		</div>
	);
}
