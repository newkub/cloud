import { type JSX, splitProps } from "solid-js";

export interface MenubarSeparatorProps extends JSX.HTMLAttributes<HTMLHRElement> {}

/** Horizontal divider between menubar items. */
export function MenubarSeparator(props: MenubarSeparatorProps) {
	const [local, rest] = splitProps(props, ["class"]);
	return <hr class={["my-1 h-px bg-border", local.class ?? ""].filter(Boolean).join(" ")} {...rest} />;
}
