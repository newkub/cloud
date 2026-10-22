import { type Accessor, createContext } from "solid-js";

export interface ResizableContextValue {
	direction: Accessor<"horizontal" | "vertical">;
	sizes: Accessor<number[]>;
	setSizeAt: (index: number, value: number) => void;
	getPanelIndex: () => number;
	getHandleIndex: () => number;
	onResize?: (sizes: number[]) => void;
	container: () => HTMLDivElement | undefined;
}

export const ResizableContext = createContext<ResizableContextValue>();
