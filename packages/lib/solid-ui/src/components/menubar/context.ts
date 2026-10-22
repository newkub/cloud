import { type Accessor, createContext, useContext } from "solid-js";

export interface MenubarContextValue {
	value: Accessor<string>;
	setValue: (value: string) => void;
	baseId: string;
}

export interface MenubarMenuContextValue {
	value: string;
}

export const MenubarContext = createContext<MenubarContextValue>();
export const MenubarMenuContext = createContext<MenubarMenuContextValue>();

export function useMenubarContext(component: string): MenubarContextValue {
	const ctx = useContext(MenubarContext);
	if (!ctx) {
		throw new Error(`${component} must be used inside a Menubar and Menubar.Menu.`);
	}
	return ctx;
}

export function useMenubarMenuContext(component: string): MenubarMenuContextValue {
	const menu = useContext(MenubarMenuContext);
	if (!menu) {
		throw new Error(`${component} must be used inside a Menubar and Menubar.Menu.`);
	}
	return menu;
}
