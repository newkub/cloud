import { createSignal, mergeProps, splitProps } from "solid-js";
import {
	COMBOBOX_LOCAL_KEYS,
	createComboboxClassNames,
	createComboboxId,
	createComboboxKeyHandler,
	DEFAULT_COMBOBOX_PROPS,
} from "./constants";
import type { ComboboxListOption, ComboboxOption, ComboboxProps } from "./types";

export function useCombobox(props: ComboboxProps) {
	const merged = mergeProps(DEFAULT_COMBOBOX_PROPS, props);
	const [local, rest] = splitProps(merged, COMBOBOX_LOCAL_KEYS);
	const [internal, setInternal] = createSignal(merged.defaultValue ?? "");
	const [open, setOpenRaw] = createSignal(false);
	const [query, setQuery] = createSignal("");
	const [active, setActive] = createSignal(0);
	const { id, listboxId } = createComboboxId();
	const selected = () => (local.value !== undefined ? local.value : internal());
	const options = () => local.options ?? [];
	const selectedLabel = () => options().find((o) => o.value === selected())?.label ?? (selected() || "");
	const defaultFilter = (o: ComboboxOption, q: string) => o.label.toLowerCase().includes(q.toLowerCase());
	const filtered = (): ComboboxListOption[] => {
		const q = query();
		const filter = local.filterOption ?? defaultFilter;
		const list: ComboboxListOption[] = options().filter((o) => filter(o, q));
		if (local.creatable && q && !options().some((o) => o.label.toLowerCase() === q.toLowerCase())) {
			list.push({
				value: q,
				label: (local.createLabel ?? ((input: string) => `Create "${input}"`))(q),
				create: true,
			});
		}
		return list;
	};
	const setOpen = (value: boolean) => {
		if (open() !== value) local.onOpenChange?.(value);
		setOpenRaw(value);
	};
	const setSelected = (next: string) => {
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
		const label = options().find((o) => o.value === next)?.label ?? next;
		setQuery(label);
		setOpen(false);
	};
	const selectOption = (option: ComboboxListOption) => {
		if (option.disabled) return;
		if (option.create) local.onCreateOption?.(option.value);
		setSelected(option.value);
	};
	const clear = () => {
		setSelected("");
		local.onClear?.();
	};
	const onInput = (value: string) => {
		setQuery(value);
		setOpen(true);
		setActive(0);
	};
	const onKeyDown = createComboboxKeyHandler(open, setOpen, setActive, filtered, selectOption, active);
	const displayValue = () => (open() ? query() : selectedLabel());
	const { className, listClassName } = createComboboxClassNames(local);
	const state = {
		local,
		rest,
		open,
		active,
		id,
		listboxId,
		selected,
		filtered,
		displayValue,
		className,
		listClassName,
	};
	const actions = { setOpen, setQuery, setActive, setSelected, selectOption, clear, onInput, onKeyDown };
	return { state, actions };
}

export type ComboboxContext = ReturnType<typeof useCombobox>;
