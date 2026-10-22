/**
 * FilterMenu - button + dropdown panel for composing list filters.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface FilterMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Number of active filters — shows a badge when > 0. @default 0 */
	activeCount?: number;
	/** Trigger label. @default "Filter" */
	label?: string;
	/** Panel content — filter rows/checkboxes. */
	children?: JSX.Element;
	/** Called to clear all filters; shows a clear row when set. */
	onClear?: () => void;
	/** Corner radius. */
	radius?: Radius;
}

export function FilterMenu(props: FilterMenuProps) {
	const [local, rest] = splitProps(props, ["class", "activeCount", "label", "children", "onClear", "radius"]);
	const [open, setOpen] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	return (
		<div ref={root} class={`solidui-filter-menu relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class={`inline-flex h-9 items-center gap-1.5 border border-input bg-background px-3 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
				aria-haspopup="true"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<NamedIcon name="settings" class="h-4 w-4 text-muted-foreground" />
				{local.label ?? "Filter"}
				<Show when={(local.activeCount ?? 0) > 0}>
					<span class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
						{local.activeCount}
					</span>
				</Show>
			</button>
			<Show when={open()}>
				<div
					class={`absolute left-0 z-popover mt-1 w-64 border border-border bg-popover p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
					role="menu"
				>
					{local.children}
					<Show when={local.onClear}>
						<button
							type="button"
							class="mt-1 w-full rounded-sm px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={() => {
								local.onClear?.();
								setOpen(false);
							}}
						>
							Clear all filters
						</button>
					</Show>
				</div>
			</Show>
		</div>
	);
}
