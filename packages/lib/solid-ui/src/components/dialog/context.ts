import { createContext, useContext } from "solid-js";

export interface DialogContextValue {
	titleId: string;
	descriptionId: string;
	onOpenChange?: (open: boolean) => void;
	unstyled?: boolean;
}

export const DialogContext = createContext<DialogContextValue>();

export const useDialogContext = () => useContext(DialogContext) ?? { titleId: "", descriptionId: "" };
