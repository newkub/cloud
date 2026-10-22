import { type Accessor, createContext } from "solid-js";

export interface TabsContextValue {
	value: Accessor<string>;
	setValue: (value: string) => void;
	baseId: string;
}

export const TabsContext = createContext<TabsContextValue>();

/** Visual style of the tab bar — pills (default) or underline. */
export const TabsListContext = createContext<Accessor<"pills" | "underline">>(() => "pills" as const);

let tabsCounter = 0;

export const nextTabsId = () => `tabs-${++tabsCounter}`;
