import type { Setter } from "solid-js";
import { type Radius, radiusMap } from "../../lib/variants";
import type { ComboboxListOption, ComboboxOption } from "./types";

let comboboxId = 0;

export const DEFAULT_COMBOBOX_PROPS = {
	options: [] as ComboboxOption[],
	placeholder: "Select an option…",
	emptyText: "No results found.",
};

export const COMBOBOX_LOCAL_KEYS = [
	"class",
	"variant",
	"size",
	"options",
	"value",
	"defaultValue",
	"onChange",
	"placeholder",
	"emptyText",
	"inputClass",
	"listClass",
	"disabled",
	"invalid",
	"clearable",
	"clearLabel",
	"onClear",
	"loading",
	"loadingText",
	"onOpenChange",
	"creatable",
	"createLabel",
	"onCreateOption",
	"filterOption",
	"radius",
] as const;

export function createComboboxId() {
	const id = `combobox-${++comboboxId}`;
	return { id, listboxId: `${id}-listbox` };
}

export function createComboboxClassNames(local: { class?: string; listClass?: string; radius?: Radius }) {
	const className = () => ["relative w-full", local.class ?? ""].filter(Boolean).join(" ");
	const listClassName = () =>
		[
			"absolute z-popover mt-1 max-h-64 w-full overflow-auto border border-border bg-surface p-1 shadow-md motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			radiusMap[local.radius ?? "xl"],
			local.listClass ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return { className, listClassName };
}

export function createComboboxKeyHandler(
	open: () => boolean,
	setOpen: (value: boolean) => void,
	setActive: Setter<number>,
	filtered: () => ComboboxListOption[],
	selectOption: (option: ComboboxListOption) => void,
	active: () => number,
) {
	return (e: KeyboardEvent) => {
		const list = filtered();
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, list.length - 1));
			if (!open()) setOpen(true);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
			if (!open()) setOpen(true);
		} else if (e.key === "Home") {
			e.preventDefault();
			setActive(0);
		} else if (e.key === "End") {
			e.preventDefault();
			setActive(Math.max(list.length - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const item = list[active()];
			if (item) selectOption(item);
		} else if (e.key === "Escape") {
			setOpen(false);
		}
	};
}
