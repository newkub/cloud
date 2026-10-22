import type { JSX } from "solid-js";
import type { Elevation, Radius } from "../../lib/variants";

export interface ContextMenuItem {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Keyboard shortcut hint rendered at the end. */
	shortcut?: string;
	/** Danger styling (delete/remove actions). @default false */
	danger?: boolean;
	/** Render a separator row instead of an item. @default false */
	separator?: boolean;
}

export interface ContextMenuProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	items?: ContextMenuItem[];
	/** Whether selecting an item closes the menu. @default true */
	closeOnSelect?: boolean;
	/** Disable the trigger — context menu won't open. @default false */
	disabled?: boolean;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Menu corner radius. @default "xl" */
	radius?: Radius;
	/** Menu shadow elevation. */
	elevation?: Elevation;
	children?: JSX.Element;
}

export interface ContextMenuRefs {
	area?: HTMLButtonElement;
	content?: HTMLDivElement;
}
