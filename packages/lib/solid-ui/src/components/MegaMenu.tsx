/**
 * MegaMenu — multi-column dropdown navigation panel with optional featured slot.
 * Opens on hover, focus, or click; Escape closes and returns focus to the trigger.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface MegaMenuItem {
	/** Item label. */
	label: string;
	/** Item target. */
	href: string;
	/** Short description under the label. */
	desc?: string;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
}

export interface MegaMenuColumn {
	/** Column heading. */
	label: string;
	/** Links in this column. */
	items: MegaMenuItem[];
}

export interface MegaMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Custom trigger content. Falls back to `label`. */
	trigger?: JSX.Element;
	/** Plain-text trigger label used when `trigger` is not provided. */
	label?: string;
	/** Link columns shown inside the panel. */
	columns?: MegaMenuColumn[];
	/** Promotional/featured slot rendered beside the columns. */
	featured?: JSX.Element;
	/** Panel surface treatment. @default "default" */
	variant?: SurfaceVariant;
	/** Panel corner radius. @default "xl" */
	radius?: Radius;
}

const colCountMap = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-4",
} as const;

export function MegaMenu(props: MegaMenuProps) {
	const [local, rest] = splitProps(props, ["class", "trigger", "label", "columns", "featured", "variant", "radius"]);
	const [open, setOpen] = createSignal(false);
	let rootRef: HTMLDivElement | undefined;
	let triggerRef: HTMLButtonElement | undefined;

	const cols = () => colCountMap[Math.min(Math.max(local.columns?.length ?? 1, 1), 4) as 1 | 2 | 3 | 4];

	useEscapeKey(() => setOpen(false));

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && open()) {
			e.preventDefault();
			setOpen(false);
			triggerRef?.focus();
		}
	};

	const onFocusOut = (e: FocusEvent) => {
		if (!rootRef?.contains(e.relatedTarget as Node)) setOpen(false);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover/focus-intent container for the menu panel; the trigger button owns interaction semantics.
		<div
			ref={rootRef}
			class={`solidui-mega-menu relative inline-block ${local.class ?? ""}`.trim()}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onFocusIn={() => setOpen(true)}
			onFocusOut={onFocusOut}
			onKeyDown={onKeyDown}
			{...rest}
		>
			<button
				type="button"
				ref={triggerRef}
				class="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				aria-haspopup="true"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				{local.trigger ?? local.label}
				<svg
					class={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
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
				<div
					role="menu"
					class={`absolute left-0 top-full z-popover mt-1 w-screen max-w-3xl border p-6 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "xl"]}`}
				>
					<div class="flex gap-8">
						<div class={`grid flex-1 gap-8 ${cols()}`}>
							<For each={local.columns ?? []}>
								{(col) => (
									<div>
										<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.label}</p>
										<ul class="space-y-1">
											<For each={col.items}>
												{(item) => (
													<li>
														<a
															href={item.href}
															role="menuitem"
															class="flex items-start gap-3 rounded-md p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
														>
															<Show when={item.icon}>
																<span
																	class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
																	aria-hidden="true"
																>
																	{item.icon}
																</span>
															</Show>
															<span class="min-w-0">
																<span class="block truncate text-sm font-medium">{item.label}</span>
																<Show when={item.desc}>
																	<span class="block text-xs text-muted-foreground">{item.desc}</span>
																</Show>
															</span>
														</a>
													</li>
												)}
											</For>
										</ul>
									</div>
								)}
							</For>
						</div>
						<Show when={local.featured}>
							<div class="w-56 shrink-0 rounded-lg bg-muted p-4">{local.featured}</div>
						</Show>
					</div>
				</div>
			</Show>
		</div>
	);
}
