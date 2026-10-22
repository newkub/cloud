/**
 * NavItem — single navigation row with icon, label, and badge. Renders `<a>` when `href` is set, `<button>` otherwise.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface NavItemProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Item text. */
	label: string;
	/** Link target — renders an anchor when provided. */
	href?: string;
	/** Small badge at the row end. */
	badge?: string | number;
	/** Active state — sets `aria-current="page"`. */
	active?: boolean;
	/** Non-interactive state. */
	disabled?: boolean;
	/** Nesting depth — adds indentation per level. @default 0 */
	indent?: number;
	/** Click handler (works on both anchor and button). */
	onClick?: (e: MouseEvent) => void;
}

export function NavItem(props: NavItemProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"icon",
		"label",
		"href",
		"badge",
		"active",
		"disabled",
		"indent",
		"onClick",
		"style",
	]);

	const indentStyle = (): JSX.CSSProperties | string | undefined => {
		if (!local.indent) return local.style;
		const pad = `${local.indent * 0.75}rem`;
		if (typeof local.style === "string") return `${local.style}; padding-inline-start: ${pad}`;
		return { ...(local.style as JSX.CSSProperties), "padding-inline-start": pad };
	};

	const cls = `solidui-nav-item flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
		local.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
	} ${local.disabled ? "pointer-events-none opacity-50" : ""} ${local.class ?? ""}`;

	const inner = (
		<>
			<Show when={local.icon}>
				<span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
					{local.icon}
				</span>
			</Show>
			<span class="min-w-0 flex-1 truncate text-left">{local.label}</span>
			<Show when={local.badge !== undefined}>
				<span class="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{local.badge}</span>
			</Show>
		</>
	);

	return local.href ? (
		<a
			href={local.href}
			class={cls.trim()}
			style={indentStyle()}
			aria-current={local.active ? "page" : undefined}
			aria-disabled={local.disabled ? true : undefined}
			tabindex={local.disabled ? -1 : undefined}
			onClick={local.onClick}
			{...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
		>
			{inner}
		</a>
	) : (
		<button
			type="button"
			class={cls.trim()}
			style={indentStyle()}
			disabled={local.disabled}
			aria-current={local.active ? "page" : undefined}
			onClick={local.onClick}
			{...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{inner}
		</button>
	);
}
