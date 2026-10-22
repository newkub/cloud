import { type JSX, splitProps } from "solid-js";

export interface DropdownMenuGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/** Grouping wrapper — applies `role="group"` for a11y. */
export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	return (
		// biome-ignore lint/a11y/useSemanticElements: ARIA menu pattern — groups related menuitems inside role=menu
		<div role="group" class={local.class ?? ""} {...rest}>
			{local.children}
		</div>
	);
}
