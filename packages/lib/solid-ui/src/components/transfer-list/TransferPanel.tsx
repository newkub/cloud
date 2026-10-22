/**
 * One side of a TransferList — header with select-all checkbox and item count,
 * optional filter input and a scrollable checkbox list.
 */
import { For, Show } from "solid-js";
import { type Radius, radiusMap } from "../../lib/variants";
import { filterItems, type TransferItem, textSize } from "./types";

export interface TransferPanelProps {
	/** Items in this panel (accessor — stays reactive). */
	items: () => TransferItem[];
	/** Current filter query (accessor). */
	query: () => string;
	onQuery: (q: string) => void;
	/** Checked item ids (accessor). */
	checked: () => Set<string>;
	setChecked: (s: Set<string>) => void;
	title: string;
	emptyText: string;
	selectAllLabel: string;
	filterPlaceholder: string;
	searchable: boolean;
	selectAll: boolean;
	maxHeight?: string;
	size: "sm" | "md" | "lg";
	radius: Radius;
	disabled?: boolean;
}

export function TransferPanel(props: TransferPanelProps) {
	const visible = () => filterItems(props.items() ?? [], props.query());
	const enabledVisible = () => visible().filter((i) => !i.disabled);
	const allChecked = () => enabledVisible().length > 0 && enabledVisible().every((i) => props.checked().has(i.id));

	const toggle = (id: string) => {
		const next = new Set(props.checked());
		if (next.has(id)) next.delete(id);
		else next.add(id);
		props.setChecked(next);
	};
	const toggleAll = () => {
		const enabled = visible().filter((i) => !i.disabled);
		if (enabled.every((i) => props.checked().has(i.id)) && enabled.length > 0) props.setChecked(new Set<string>());
		else props.setChecked(new Set(enabled.map((i) => i.id)));
	};

	return (
		<div
			class={`flex min-w-0 flex-1 flex-col overflow-hidden ${radiusMap[props.radius]} border border-border bg-surface`}
		>
			<div class="border-b border-border px-2.5 py-1.5">
				<div class="flex items-center justify-between gap-2">
					<Show
						when={props.selectAll}
						fallback={<span class={`font-medium text-muted-foreground ${textSize[props.size]}`}>{props.title}</span>}
					>
						<label class="flex min-w-0 items-center gap-1.5">
							<input
								type="checkbox"
								class="h-3.5 w-3.5 accent-primary"
								disabled={props.disabled || enabledVisible().length === 0}
								checked={allChecked()}
								aria-label={`${props.selectAllLabel} — ${props.title}`}
								onChange={toggleAll}
							/>
							<span class={`truncate font-medium text-muted-foreground ${textSize[props.size]}`}>{props.title}</span>
						</label>
					</Show>
					<span class={`tabular-nums text-muted-foreground/60 ${textSize[props.size]}`}>
						{props.checked().size > 0 ? `${props.checked().size}/` : ""}
						{(props.items() ?? []).length}
					</span>
				</div>
				<Show when={props.searchable}>
					<input
						type="text"
						value={props.query()}
						placeholder={props.filterPlaceholder}
						disabled={props.disabled}
						aria-label={`${props.filterPlaceholder} ${props.title}`}
						class={`mt-1 h-7 w-full rounded border border-border bg-transparent px-1.5 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${textSize[props.size]}`}
						onInput={(e) => props.onQuery(e.currentTarget.value)}
					/>
				</Show>
			</div>
			<ul class="flex-1 overflow-y-auto p-1" style={{ "max-height": props.maxHeight ?? "12rem" }}>
				<For
					each={visible()}
					fallback={
						<li class={`px-2 py-3 text-center text-muted-foreground/70 ${textSize[props.size]}`}>{props.emptyText}</li>
					}
				>
					{(item) => (
						<li>
							<label
								class={`flex items-center gap-2 rounded px-2 py-1.5 ${item.disabled || props.disabled ? "opacity-50" : "cursor-pointer hover:bg-muted/50"}`}
							>
								<input
									type="checkbox"
									class="h-3.5 w-3.5 accent-primary"
									disabled={item.disabled || props.disabled}
									checked={props.checked().has(item.id)}
									onChange={() => toggle(item.id)}
								/>
								<span class="min-w-0">
									<span class={`block truncate text-foreground ${textSize[props.size]}`}>{item.label}</span>
									<Show when={item.description}>
										<span class="block truncate text-2xs text-muted-foreground">{item.description}</span>
									</Show>
								</span>
							</label>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
