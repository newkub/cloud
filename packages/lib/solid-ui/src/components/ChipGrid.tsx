/**
 * ChipGrid — responsive grid of toggleable chips with single/multi select.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface ChipGridItem {
	/** Chip label — also used as its selection key */
	label: string;
	/** Optional leading icon */
	icon?: JSX.Element;
	/** Initially selected @default false */
	selected?: boolean;
	/** Optional trailing count badge */
	count?: number;
	/** Disable this chip */
	disabled?: boolean;
}

export interface ChipGridProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Chips to render */
	items: ChipGridItem[];
	/** Allow multiple selected chips @default false */
	multi?: boolean;
	/** Called with the selected labels after each toggle */
	onChange?: (selected: string[]) => void;
	/** Chip density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius on chips. @default "md" */
	radius?: Radius;
}

const sizeClass = {
	sm: "gap-1 px-2 py-1 text-2xs",
	md: "gap-1.5 px-3 py-1.5 text-xs",
	lg: "gap-2 px-3.5 py-2 text-sm",
} as const;

export function ChipGrid(props: ChipGridProps) {
	const [local, rest] = splitProps(props, ["class", "items", "multi", "onChange", "size", "radius"]);
	const [selected, setSelected] = createSignal<Set<string>>(
		new Set((local.items ?? []).filter((i) => i.selected).map((i) => i.label)),
	);

	const toggle = (item: ChipGridItem) => {
		if (item.disabled) return;
		const next = new Set(selected());
		if (local.multi) {
			if (next.has(item.label)) next.delete(item.label);
			else next.add(item.label);
		} else {
			next.clear();
			if (!selected().has(item.label)) next.add(item.label);
		}
		setSelected(next);
		local.onChange?.([...next]);
	};

	return (
		<div
			class={`solidui-chip-grid grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items ?? []}>
				{(item) => {
					const active = () => selected().has(item.label);
					return (
						<button
							type="button"
							aria-pressed={active()}
							disabled={item.disabled}
							onClick={() => toggle(item)}
							class={`inline-flex items-center justify-center border font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${
								active()
									? "border-primary/40 bg-primary/10 text-primary"
									: "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
							}`}
						>
							<Show when={item.icon}>
								<span class="shrink-0" aria-hidden="true">
									{item.icon}
								</span>
							</Show>
							<span class="truncate">{item.label}</span>
							<Show when={item.count !== undefined}>
								<span
									class={`ml-auto shrink-0 rounded-full px-1.5 tabular-nums ${active() ? "bg-primary/15 text-primary" : "bg-background text-muted-foreground"}`}
								>
									{item.count}
								</span>
							</Show>
						</button>
					);
				}}
			</For>
		</div>
	);
}
