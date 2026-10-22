/**
 * FilterTabs — horizontal tab row with per-tab count badges and an animated underline indicator.
 */
import { createEffect, createSignal, For, type JSX, onMount, Show, splitProps } from "solid-js";
import { Badge } from "./Badge";

export interface FilterTab {
	/** Unique tab id passed to `onChange`. */
	id: string;
	/** Tab label. */
	label: string;
	/** Count badge rendered after the label. */
	count?: number | string;
}

export interface FilterTabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Tab descriptors. */
	tabs: FilterTab[];
	/** Currently selected tab id. */
	value?: string;
	/** Called with the newly selected tab id. */
	onChange?: (id: string) => void;
	/** Stretch the row to fill its container. @default false */
	fullWidth?: boolean;
}

export function FilterTabs(props: FilterTabsProps) {
	const [local, rest] = splitProps(props, ["class", "tabs", "value", "onChange", "fullWidth"]);
	let listRef: HTMLDivElement | undefined;
	const [indicator, setIndicator] = createSignal<{ left: number; width: number }>();

	const measure = () => {
		if (!listRef) return;
		const i = (local.tabs ?? []).findIndex((t) => t.id === local.value);
		const el = listRef.querySelectorAll<HTMLElement>('[role="tab"]')[i];
		if (el && el.offsetWidth > 0) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
	};
	onMount(() => createEffect(measure));

	const onKeyDown = (e: KeyboardEvent) => {
		const tabs = local.tabs ?? [];
		const els = Array.from(listRef?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
		const idx = els.indexOf(e.target as HTMLElement);
		if (idx === -1 || els.length === 0) return;
		let next = -1;
		if (e.key === "ArrowRight") next = (idx + 1) % els.length;
		else if (e.key === "ArrowLeft") next = (idx - 1 + els.length) % els.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = els.length - 1;
		if (next === -1) return;
		e.preventDefault();
		els[next].focus();
		local.onChange?.(tabs[next].id);
	};

	return (
		<div
			role="tablist"
			class={`solidui-filter-tabs ${local.fullWidth ? "w-full" : "inline-flex"} ${local.class ?? ""}`.trim()}
			onKeyDown={onKeyDown}
			{...rest}
		>
			<div
				ref={listRef}
				class={`relative flex items-center gap-1 border-b border-border ${local.fullWidth ? "w-full" : ""}`}
			>
				<Show when={indicator()}>
					{(r) => (
						<span
							aria-hidden="true"
							class="absolute bottom-0 h-0.5 bg-primary transition-all motion-reduce:transition-none"
							style={{ left: `${r().left}px`, width: `${r().width}px` }}
						/>
					)}
				</Show>
				<For each={local.tabs ?? []}>
					{(tab) => {
						const active = () => tab.id === local.value;
						return (
							<button
								type="button"
								role="tab"
								class={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${local.fullWidth ? "flex-1" : ""} ${
									active() ? "text-primary" : "text-muted-foreground hover:text-foreground"
								}`}
								aria-selected={active()}
								tabindex={active() ? 0 : -1}
								onClick={() => local.onChange?.(tab.id)}
							>
								<span class="truncate">{tab.label}</span>
								<Show when={tab.count !== undefined}>
									<Badge variant="secondary" size="sm">
										{tab.count}
									</Badge>
								</Show>
							</button>
						);
					}}
				</For>
			</div>
		</div>
	);
}
