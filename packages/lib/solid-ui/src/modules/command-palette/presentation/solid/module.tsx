/**
 * solid-modules-command-palette Solid Module
 */

import { createContext, createSignal, type JSX, useContext } from "solid-js";

interface CommandPaletteContextType {
	isOpen: () => boolean;
	toggle: () => void;
	open: () => void;
	close: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export function CommandPaletteProvider(props: { children: JSX.Element }) {
	const [isOpen, setIsOpen] = createSignal(false);

	const toggle = () => setIsOpen((prev) => !prev);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	const value: CommandPaletteContextType = {
		isOpen,
		toggle,
		open,
		close,
	};

	return <CommandPaletteContext.Provider value={value}>{props.children}</CommandPaletteContext.Provider>;
}

export function useCommandPalette() {
	const context = useContext(CommandPaletteContext);
	if (!context) {
		throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
	}
	return context;
}

export default CommandPaletteProvider;
