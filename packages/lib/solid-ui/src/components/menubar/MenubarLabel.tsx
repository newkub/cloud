import { type JSX, splitProps } from "solid-js";

export interface MenubarLabelProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/** Non-interactive section label inside a menubar popup. */
export function MenubarLabel(props: MenubarLabelProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	return (
		<div
			class={["px-2 py-1.5 text-xs font-semibold text-muted-foreground", local.class ?? ""].filter(Boolean).join(" ")}
			{...rest}
		>
			{local.children}
		</div>
	);
}
