/**
 * Dropdown menu
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { DropdownMenuContext } from "./dropdown-menu/context";

export type { DropdownMenuCheckboxItemProps } from "./dropdown-menu/DropdownMenuCheckboxItem";
export { DropdownMenuCheckboxItem } from "./dropdown-menu/DropdownMenuCheckboxItem";
export type { DropdownMenuContentProps } from "./dropdown-menu/DropdownMenuContent";
export { DropdownMenuContent } from "./dropdown-menu/DropdownMenuContent";
export type { DropdownMenuGroupProps } from "./dropdown-menu/DropdownMenuGroup";
export { DropdownMenuGroup } from "./dropdown-menu/DropdownMenuGroup";
export type { DropdownMenuItemProps } from "./dropdown-menu/DropdownMenuItem";
export { DropdownMenuItem } from "./dropdown-menu/DropdownMenuItem";
export type { DropdownMenuLabelProps } from "./dropdown-menu/DropdownMenuLabel";
export { DropdownMenuLabel } from "./dropdown-menu/DropdownMenuLabel";
export type { DropdownMenuSeparatorProps } from "./dropdown-menu/DropdownMenuSeparator";
export { DropdownMenuSeparator } from "./dropdown-menu/DropdownMenuSeparator";
export type { DropdownMenuTriggerProps } from "./dropdown-menu/DropdownMenuTrigger";
export { DropdownMenuTrigger } from "./dropdown-menu/DropdownMenuTrigger";

export interface DropdownMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Whether items close the menu on click by default — override per item. @default true */
	closeOnSelect?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DropdownMenu(props: DropdownMenuProps) {
	const merged = mergeProps({ defaultOpen: false }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"variant",
		"open",
		"defaultOpen",
		"onOpenChange",
		"closeOnSelect",
		"children",
	]);
	const [internal, setInternal] = createSignal(merged.defaultOpen);
	const [trigger, setTrigger] = createSignal<HTMLElement>();
	const [content, setContent] = createSignal<HTMLElement>();

	const open = () => (local.open !== undefined ? local.open : internal());
	const setOpen = (value: boolean) => {
		setInternal(value);
		local.onOpenChange?.(value);
	};
	const toggle = () => setOpen(!open());

	// Composite target covering both the trigger and the menu content.
	const menuRoot = () => {
		const c = content();
		if (!c) return undefined;
		const t = trigger();
		return { contains: (node: Node) => c.contains(node) || !!t?.contains(node) } as unknown as HTMLElement;
	};
	useClickOutside(menuRoot, () => setOpen(false), { events: ["mousedown"] });
	useEscapeKey(() => setOpen(false));

	const className = () =>
		[
			"relative inline-block",
			merged.radius ? radiusMap[merged.radius] : "",
			merged.elevation ? elevationMap[merged.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<DropdownMenuContext.Provider
			value={{
				open,
				toggle,
				setOpen,
				trigger,
				content,
				setTrigger,
				setContent,
				variant: () => local.variant,
				closeOnSelect: () => local.closeOnSelect ?? true,
			}}
		>
			<div class={className()} data-state={open() ? "open" : "closed"} {...rest}>
				{local.children}
			</div>
		</DropdownMenuContext.Provider>
	);
}
