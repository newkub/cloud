import { type JSX, splitProps } from "solid-js";

export interface MenubarGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/** Grouping wrapper — applies `role="group"` for a11y. */
export function MenubarGroup(props: MenubarGroupProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	return (
		// biome-ignore lint/a11y/useSemanticElements: ARIA menu pattern — groups related menuitems inside role=menu
		<div role="group" class={local.class ?? ""} {...rest}>
			{local.children}
		</div>
	);
}
