import type { ControlSize } from "../../lib/variants";

export const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

export const padLeft: Record<ControlSize, string> = {
	sm: "pl-7",
	md: "pl-8",
	lg: "pl-9",
};

export const padRight: Record<ControlSize, string> = {
	sm: "pr-7",
	md: "pr-8",
	lg: "pr-9",
};
