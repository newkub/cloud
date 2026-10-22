import { type Accessor, createContext, useContext } from "solid-js";
import type { DropdownMenuProps } from "../DropdownMenu";

export type MenuSide = "top" | "bottom" | "left" | "right";
export type MenuAlign = "start" | "center" | "end";

export interface DropdownMenuContextValue {
	open: Accessor<boolean>;
	toggle: () => void;
	setOpen: (open: boolean) => void;
	trigger: Accessor<HTMLElement | undefined>;
	content: Accessor<HTMLElement | undefined>;
	setTrigger: (el: HTMLElement) => void;
	setContent: (el: HTMLElement) => void;
	variant: Accessor<DropdownMenuProps["variant"]>;
	/** Default `closeOnSelect` for menu items. */
	closeOnSelect: Accessor<boolean>;
}

export const DropdownMenuContext = createContext<DropdownMenuContextValue>();

export function useDropdownMenuContext(component: string): DropdownMenuContextValue {
	const ctx = useContext(DropdownMenuContext);
	if (!ctx) {
		throw new Error(`${component} must be used inside a DropdownMenu.`);
	}
	return ctx;
}
