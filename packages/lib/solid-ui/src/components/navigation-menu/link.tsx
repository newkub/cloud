import { type JSX, splitProps, useContext } from "solid-js";
import { type Radius, radiusMap } from "../../lib/variants";
import { NavigationMenuContext } from "./context";

export interface NavigationMenuLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Highlight as the current page/section. @default false */
	active?: boolean;
	/** Close the open panel after navigation. @default true */
	closeOnSelect?: boolean;
	/** Corner radius. */ radius?: Radius;
}

/** Styled link for inside `NavigationMenuContent` panels. */
export function NavigationMenuLink(props: NavigationMenuLinkProps) {
	const ctx = useContext(NavigationMenuContext);
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "active", "closeOnSelect", "radius"]);

	const className = () =>
		[
			"block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			local.active ? "bg-primary/10 font-medium text-primary" : "text-foreground hover:bg-muted hover:text-foreground",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
		if (local.closeOnSelect ?? true) ctx?.setValue("");
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent & { currentTarget: HTMLAnchorElement }) => void)(e);
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents lint/a11y/useValidAnchor: nav link performs page navigation; click also closes the open panel, Enter is native
		<a class={className()} onClick={onClick} aria-current={local.active ? "page" : undefined} {...rest}>
			{local.children}
		</a>
	);
}
