/**
 * BranchPicker - searchable git branch dropdown for dev UIs.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface BranchPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Branch names. */
	branches: string[];
	/** Active branch. */
	value?: string;
	/** Called with the picked branch. */
	onSelect?: (branch: string) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function BranchPicker(props: BranchPickerProps) {
	const [local, rest] = splitProps(props, ["class", "branches", "value", "onSelect", "radius"]);
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal("");
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	const filtered = () => {
		const q = query().toLowerCase();
		return q ? local.branches.filter((b) => b.toLowerCase().includes(q)) : local.branches;
	};

	const pick = (b: string) => {
		local.onSelect?.(b);
		setOpen(false);
	};

	return (
		<div ref={root} class={`solidui-branch-picker relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class={`inline-flex h-9 items-center gap-2 border border-input bg-background px-3 text-sm font-mono hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
				aria-haspopup="listbox"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<NamedIcon name="git-branch" class="h-4 w-4 text-muted-foreground" />
				<span class="max-w-[160px] truncate">{local.value ?? "Select branch"}</span>
				<NamedIcon name="chevron-down" class="h-3.5 w-3.5 text-muted-foreground" />
			</button>
			<Show when={open()}>
				<div
					class={`absolute left-0 z-popover mt-1 w-64 border border-border bg-popover shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
				>
					<input
						class="w-full border-b border-border bg-transparent px-3 py-2 text-sm outline-none"
						placeholder="Filter branches…"
						value={query()}
						onInput={(e) => setQuery(e.currentTarget.value)}
					/>
					<div class="max-h-56 overflow-y-auto p-1" role="listbox">
						<For each={filtered()}>
							{(b) => (
								<div
									role="option"
									tabIndex={0}
									aria-selected={b === local.value}
									class={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 font-mono text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${b === local.value ? "bg-accent" : ""}`}
									onClick={() => pick(b)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											pick(b);
										}
									}}
								>
									<NamedIcon name="git-branch" class="h-3.5 w-3.5 text-muted-foreground" />
									<span class="flex-1 truncate">{b}</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</Show>
		</div>
	);
}
