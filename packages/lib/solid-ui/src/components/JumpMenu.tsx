/**
 * JumpMenu — "jump to" dropdown listing grouped sections with letter-group headers and a typeahead filter.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";

export interface JumpMenuItem {
	/** Link label. */
	label: string;
	/** Link target. */
	href: string;
}

export interface JumpMenuSection {
	/** Group header (letter or section name). */
	group: string;
	/** Links in this group. */
	items: JumpMenuItem[];
}

export interface JumpMenuProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Grouped sections rendered in the dropdown. */
	sections: JumpMenuSection[];
	/** Trigger label. @default "Jump to…" */
	label?: string;
	/** Typeahead input placeholder. @default "Filter…" */
	placeholder?: string;
	/** Called when a link is chosen (before navigation). */
	onSelect?: (item: JumpMenuItem) => void;
}

export function JumpMenu(props: JumpMenuProps) {
	const [local, rest] = splitProps(props, ["class", "sections", "label", "placeholder", "onSelect"]);
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal("");
	let rootRef: HTMLDivElement | undefined;
	let inputRef: HTMLInputElement | undefined;

	const filtered = () =>
		(local.sections ?? [])
			.map((section) => ({
				...section,
				items: section.items.filter((item) => item.label.toLowerCase().includes(query().trim().toLowerCase())),
			}))
			.filter((section) => section.items.length > 0);

	const close = () => {
		setOpen(false);
		setQuery("");
	};

	useClickOutside(() => rootRef, close, { events: ["pointerdown"] });
	useEscapeKey(close);

	return (
		<div ref={rootRef} class={`solidui-jump-menu relative inline-block ${local.class ?? ""}`.trim()} {...rest}>
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				aria-haspopup="true"
				aria-expanded={open()}
				onClick={() => {
					setOpen((v) => !v);
					if (!open()) inputRef?.focus();
				}}
			>
				{local.label ?? "Jump to…"}
				<svg
					class={`h-3.5 w-3.5 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			<Show when={open()}>
				<div class="absolute left-0 z-dropdown mt-1 w-56 rounded-md border border-border bg-surface p-1 shadow-md">
					<input
						ref={inputRef}
						type="text"
						class="mb-1 h-8 w-full rounded-sm border border-border bg-background px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						placeholder={local.placeholder ?? "Filter…"}
						value={query()}
						onInput={(e) => setQuery(e.currentTarget.value)}
					/>
					<ul class="max-h-64 overflow-y-auto">
						<For each={filtered()}>
							{(section) => (
								<li>
									<div class="px-2 pt-2 pb-1 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
										{section.group}
									</div>
									<ul>
										<For each={section.items}>
											{(item) => (
												<li>
													<a
														href={item.href}
														class="block rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
														onClick={() => {
															local.onSelect?.(item);
															close();
														}}
													>
														{item.label}
													</a>
												</li>
											)}
										</For>
									</ul>
								</li>
							)}
						</For>
						<Show when={filtered().length === 0}>
							<li class="px-2 py-3 text-center text-xs text-muted-foreground">No matches</li>
						</Show>
					</ul>
				</div>
			</Show>
		</div>
	);
}
