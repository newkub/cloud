/**
 * NavBar — responsive top navigation bar with brand, links, actions, and a mobile hamburger menu.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface NavBarLink {
	/** Link text. */
	label: string;
	/** Link target. */
	href: string;
	/** Marks the current page. */
	active?: boolean;
}

export interface NavBarProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Brand/logo slot rendered at the start. */
	brand?: JSX.Element;
	/** Primary navigation links. */
	links?: NavBarLink[];
	/** Actions slot rendered at the end (buttons, avatar, search, …). */
	actions?: JSX.Element;
	/** Stick to the top of the viewport. */
	sticky?: boolean;
	/** Bottom border separator. @default true */
	bordered?: boolean;
	/** Called when the mobile menu opens or closes. */
	onMenuToggle?: (open: boolean) => void;
	/** Surface treatment of the bar. @default "default" */
	variant?: SurfaceVariant;
}

export function NavBar(props: NavBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"brand",
		"links",
		"actions",
		"sticky",
		"bordered",
		"onMenuToggle",
		"variant",
	]);
	const [open, setOpen] = createSignal(false);
	const toggle = () => {
		const next = !open();
		setOpen(next);
		local.onMenuToggle?.(next);
	};
	const linkCls = (active?: boolean) =>
		`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
			active ? "text-primary" : "text-muted-foreground hover:text-foreground"
		}`;
	const link = (l: NavBarLink, block = false) => (
		<a
			href={l.href}
			class={`${block ? "block" : ""} ${linkCls(l.active)}`}
			aria-current={l.active ? "page" : undefined}
		>
			{l.label}
		</a>
	);

	return (
		<nav
			class={`solidui-nav-bar ${local.sticky ? "sticky top-0 z-40" : ""} ${surfaceVariants[local.variant ?? "default"]} ${(local.bordered ?? true) ? "border-b border-border" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
				<Show when={local.brand}>
					<div class="flex shrink-0 items-center">{local.brand}</div>
				</Show>
				<ul class="hidden flex-1 items-center gap-1 md:flex">
					<For each={local.links ?? []}>{(l) => <li>{link(l)}</li>}</For>
				</ul>
				<Show when={local.actions}>
					<div class="ml-auto hidden items-center gap-2 md:flex">{local.actions}</div>
				</Show>
				<button
					type="button"
					class="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden"
					aria-expanded={open()}
					aria-label={open() ? "Close navigation menu" : "Open navigation menu"}
					onClick={toggle}
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<Show when={open()} fallback={<path d="M4 7h16M4 12h16M4 17h16" />}>
							<path d="M6 6l12 12M18 6L6 18" />
						</Show>
					</svg>
				</button>
			</div>
			<Show when={open()}>
				<ul class="border-t border-border px-4 py-2 md:hidden">
					<For each={local.links ?? []}>{(l) => <li>{link(l, true)}</li>}</For>
					<Show when={local.actions}>
						<li class="flex items-center gap-2 px-3 py-2">{local.actions}</li>
					</Show>
				</ul>
			</Show>
		</nav>
	);
}
