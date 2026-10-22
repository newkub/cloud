/**
 * WorkspaceSwitcher - org/workspace dropdown used in SaaS app headers.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface Workspace {
	/** Workspace id. */
	id: string;
	/** Display name. */
	name: string;
	/** Short badge text, e.g. initials or plan. */
	badge?: string;
}

export interface WorkspaceSwitcherProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Workspaces in the dropdown. */
	workspaces?: Workspace[];
	/** Active workspace id. */
	value?: string;
	/** Called with the picked workspace id. */
	onSelect?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function WorkspaceSwitcher(props: WorkspaceSwitcherProps) {
	const [local, rest] = splitProps(props, ["class", "workspaces", "value", "onSelect", "radius"]);
	const [open, setOpen] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	const current = () => (local.workspaces ?? []).find((w) => w.id === local.value) ?? (local.workspaces ?? [])[0];

	return (
		<div ref={root} class={`solidui-workspace-switcher relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class={`inline-flex h-9 items-center gap-2 border border-input bg-background px-3 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
				aria-haspopup="listbox"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<span class="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-semibold text-primary-foreground">
					{(current()?.badge ?? current()?.name ?? "?").slice(0, 2).toUpperCase()}
				</span>
				<span class="max-w-[140px] truncate">{current()?.name}</span>
				<NamedIcon name="chevron-down" class="h-3.5 w-3.5 text-muted-foreground" />
			</button>
			<Show when={open()}>
				<div
					class={`absolute left-0 z-popover mt-1 w-56 border border-border bg-popover p-1 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
					role="listbox"
				>
					<For each={local.workspaces ?? []}>
						{(w) => (
							<div
								role="option"
								tabIndex={0}
								aria-selected={w.id === local.value}
								class={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${w.id === local.value ? "bg-accent" : ""}`}
								onClick={() => {
									local.onSelect?.(w.id);
									setOpen(false);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										local.onSelect?.(w.id);
										setOpen(false);
									}
								}}
							>
								<span class="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-semibold">
									{(w.badge ?? w.name).slice(0, 2).toUpperCase()}
								</span>
								<span class="flex-1 truncate">{w.name}</span>
								<Show when={w.id === local.value}>
									<NamedIcon name="check" class="h-4 w-4 text-primary" />
								</Show>
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
