/**
 * BackLink - back navigation link with arrow icon and optional history fallback.
 */
import { type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";

export interface BackLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Link target; falls back to history.back() when omitted. */
	href?: string;
	/** Label text. @default "Back" */
	label?: string;
}

export function BackLink(props: BackLinkProps) {
	const [local, rest] = splitProps(props, ["class", "href", "label", "onClick", "children"]);

	const onClick = (e: MouseEvent) => {
		if (!local.href) {
			e.preventDefault();
			window.history.back();
		}
		(local.onClick as ((ev: MouseEvent) => void) | undefined)?.(e);
	};

	return (
		<a
			class={`solidui-back-link inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm ${local.class ?? ""}`}
			href={local.href ?? "#"}
			onClick={onClick}
			{...rest}
		>
			<NamedIcon name="arrow-left" class="h-4 w-4" />
			{local.children ?? local.label ?? "Back"}
		</a>
	);
}
