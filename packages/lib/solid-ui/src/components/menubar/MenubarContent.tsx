import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { contentAlignClass } from "./constants";
import { useMenubarContext, useMenubarMenuContext } from "./context";

export interface MenubarContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Alignment relative to the trigger. @default "start" */
	align?: "start" | "center" | "end";
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MenubarContent(props: MenubarContentProps) {
	const [local, rest] = splitProps(props, ["class", "children", "align", "radius", "elevation"]);
	const ctx = useMenubarContext("Menubar.Content");
	const menu = useMenubarMenuContext("Menubar.Content");

	const active = () => ctx.value() === menu.value;
	const className = () =>
		[
			"absolute top-full z-popover mt-2 w-48 max-w-[calc(100vw-1rem)] border border-border bg-surface p-2 motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			contentAlignClass[local.align ?? "start"],
			radiusMap[local.radius ?? "xl"],
			elevationMap[local.elevation ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
		if (items.length === 0) return;
		const idx = items.indexOf(e.target as HTMLButtonElement);
		let next = -1;
		if (e.key === "ArrowDown") next = idx === -1 ? 0 : (idx + 1) % items.length;
		else if (e.key === "ArrowUp") next = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = items.length - 1;
		if (next === -1) return;
		e.preventDefault();
		items[next].focus();
	};

	return (
		<Show when={active()}>
			<div class={className()} role="menu" data-state="open" onKeyDown={onKeyDown} {...rest}>
				{local.children}
			</div>
		</Show>
	);
}
