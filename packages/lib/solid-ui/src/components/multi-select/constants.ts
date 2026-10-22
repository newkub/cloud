import type { ControlSize } from "../../lib/variants";
import type { MultiSelectOption } from "./types";

export const sizeMap: Record<ControlSize, string> = {
	sm: "px-2.5 py-1.5 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-4 py-2.5 text-base",
};

export const searchSizeMap: Record<ControlSize, string> = {
	sm: "h-7 px-2 text-xs",
	md: "h-8 px-2.5 text-sm",
	lg: "h-9 px-3 text-base",
};

let multiSelectId = 0;

export const DEFAULT_MULTISELECT_PROPS = {
	options: [] as MultiSelectOption[],
	defaultValue: [] as string[],
	placeholder: "Select options…",
};

export const MULTISELECT_LOCAL_KEYS = [
	"class",
	"variant",
	"size",
	"options",
	"value",
	"defaultValue",
	"onChange",
	"placeholder",
	"disabled",
	"invalid",
	"clearable",
	"clearLabel",
	"onClear",
	"searchable",
	"searchPlaceholder",
	"emptyText",
	"loading",
	"loadingText",
	"onOpenChange",
	"filterOption",
	"maxSelected",
	"triggerClass",
	"listClass",
	"radius",
] as const;

export function createMultiSelectId() {
	const id = `multiselect-${++multiSelectId}`;
	return { id, listboxId: `${id}-listbox`, searchId: `${id}-search` };
}
