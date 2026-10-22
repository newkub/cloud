import { type Accessor, createContext } from "solid-js";

export interface NavigationMenuContextValue {
	value: Accessor<string>;
	setValue: (value: string) => void;
	baseId: string;
}

export interface NavigationMenuItemContextValue {
	value: string;
}

export const NavigationMenuContext = createContext<NavigationMenuContextValue>();
export const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue>();

let navigationMenuId = 0;

export const nextNavigationMenuId = () => `navigation-menu-${++navigationMenuId}`;
