/**
 * ContextBar — breadcrumb trail on the left with a right-side action slot.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface ContextBarCrumb {
	/** Crumb label. */
	label: string;
	/** Link target — the last crumb (current page) renders as plain text. */
	href?: string;
}

export interface ContextBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Ordered breadcrumb trail — the last entry is the current page. */
	crumbs: ContextBarCrumb[];
	/** Slot pinned to the right edge (buttons, menus, …). */
	actions?: JSX.Element;
	/** Separator between crumbs. @default "›" */
	separator?: JSX.Element;
}

export function ContextBar(props: ContextBarProps) {
	const [local, rest] = splitProps(props, ["class", "crumbs", "actions", "separator"]);

	return (
		<div
			class={`solidui-context-bar flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-2 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<nav aria-label="Breadcrumb" class="min-w-0">
				<ol class="flex min-w-0 items-center gap-1.5 text-sm">
					<For each={local.crumbs ?? []}>
						{(crumb, i) => {
							const last = () => i() === (local.crumbs?.length ?? 0) - 1;
							return (
								<li class="flex min-w-0 items-center gap-1.5">
									<Show when={i() > 0}>
										<span class="shrink-0 text-muted-foreground" aria-hidden="true">
											{local.separator ?? "›"}
										</span>
									</Show>
									{last() || !crumb.href ? (
										<span class="truncate font-medium text-foreground" aria-current={last() ? "page" : undefined}>
											{crumb.label}
										</span>
									) : (
										<a
											href={crumb.href}
											class="truncate text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										>
											{crumb.label}
										</a>
									)}
								</li>
							);
						}}
					</For>
				</ol>
			</nav>
			<Show when={local.actions}>
				<div class="flex shrink-0 items-center gap-2">{local.actions}</div>
			</Show>
		</div>
	);
}
