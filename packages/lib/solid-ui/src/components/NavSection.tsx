/**
 * NavSection — labelled navigation group, optionally collapsible.
 */
import { children, createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";

export interface NavSectionProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Section label rendered above the items. */
	label: string;
	/** Make the section expandable via a toggle button. */
	collapsible?: boolean;
	/** Initially expanded when `collapsible`. @default true */
	defaultOpen?: boolean;
	/** Section content (nav items). */
	children?: JSX.Element;
}

export function NavSection(props: NavSectionProps) {
	const [local, rest] = splitProps(props, ["class", "label", "collapsible", "defaultOpen", "children"]);
	const [open, setOpen] = createSignal(local.defaultOpen ?? true);
	const content = children(() => local.children);
	const id = `nav-section-${createUniqueId()}`;
	const triggerId = `${id}-trigger`;
	const contentId = `${id}-content`;

	return (
		<div class={`solidui-nav-section ${local.class ?? ""}`.trim()} {...rest}>
			<Show
				when={local.collapsible}
				fallback={
					<p id={triggerId} class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						{local.label}
					</p>
				}
			>
				<button
					type="button"
					id={triggerId}
					class="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-expanded={open()}
					aria-controls={open() ? contentId : undefined}
					onClick={() => setOpen((v) => !v)}
				>
					{local.label}
					<svg
						class={`h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>
			</Show>
			<Show when={!local.collapsible || open()}>
				{/* biome-ignore lint/a11y/useSemanticElements: role="group" has no semantic element equivalent; aria-labelledby names the region */}
				<div id={local.collapsible ? contentId : undefined} role="group" aria-labelledby={triggerId} class="mt-1">
					{content()}
				</div>
			</Show>
		</div>
	);
}
