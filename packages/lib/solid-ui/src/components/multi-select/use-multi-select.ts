import { createSignal, mergeProps, type Setter, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../../lib/variants";
import {
	createMultiSelectId,
	DEFAULT_MULTISELECT_PROPS,
	MULTISELECT_LOCAL_KEYS,
	searchSizeMap,
	sizeMap,
} from "./constants";
import type { MultiSelectOption, MultiSelectProps } from "./types";

function createMultiSelectClassNames(local: {
	class?: string;
	variant?: InputVariant;
	size?: ControlSize;
	triggerClass?: string;
	listClass?: string;
	radius?: Radius;
	clearable?: boolean;
}) {
	const className = () => ["relative w-full", local.class ?? ""].filter(Boolean).join(" ");
	const triggerClassName = () =>
		[
			"flex w-full items-center justify-between whitespace-normal border text-foreground transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50",
			local.clearable ? "pr-10" : "",
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.triggerClass ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const listClassName = () =>
		[
			"absolute z-popover mt-1 max-h-64 w-full overflow-auto border border-border bg-surface p-1 shadow-md motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			radiusMap[local.radius ?? "xl"],
			local.listClass ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const searchClassName = () =>
		[
			"mb-1 w-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			searchSizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
		]
			.filter(Boolean)
			.join(" ");
	return { className, triggerClassName, listClassName, searchClassName };
}

interface MultiSelectKeyHandlerState {
	open: () => boolean;
	setOpen: (value: boolean) => void;
	setActive: Setter<number>;
	options: () => MultiSelectOption[];
	toggle: (value: string) => void;
	active: () => number;
}

function createMultiSelectKeyHandler(state: MultiSelectKeyHandlerState) {
	return (e: KeyboardEvent) => {
		const list = state.options();
		if (e.key === "ArrowDown") {
			e.preventDefault();
			state.setActive((i) => Math.min(i + 1, list.length - 1));
			if (!state.open()) state.setOpen(true);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			state.setActive((i) => Math.max(i - 1, 0));
			if (!state.open()) state.setOpen(true);
		} else if (e.key === "Home") {
			e.preventDefault();
			state.setActive(0);
			if (!state.open()) state.setOpen(true);
		} else if (e.key === "End") {
			e.preventDefault();
			state.setActive(Math.max(list.length - 1, 0));
			if (!state.open()) state.setOpen(true);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const option = list[state.active()];
			if (option && !option.disabled) state.toggle(option.value);
		} else if (e.key === "Escape") {
			state.setOpen(false);
		}
	};
}

export function useMultiSelect(props: MultiSelectProps) {
	const merged = mergeProps(DEFAULT_MULTISELECT_PROPS, props);
	const [local, rest] = splitProps(merged, MULTISELECT_LOCAL_KEYS);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const [open, setOpenRaw] = createSignal(false);
	const [query, setQuery] = createSignal("");
	const [active, setActive] = createSignal(0);
	const { id, listboxId, searchId } = createMultiSelectId();
	const selected = () => (local.value !== undefined ? local.value : internal());
	const selectedOptions = () => (local.options ?? []).filter((o) => selected().includes(o.value));
	const defaultFilter = (o: MultiSelectOption, q: string) => o.label.toLowerCase().includes(q.toLowerCase());
	const filtered = () => {
		const q = query();
		if (!local.searchable || !q) return local.options ?? [];
		return (local.options ?? []).filter((o) => (local.filterOption ?? defaultFilter)(o, q));
	};
	const setOpen = (value: boolean) => {
		if (open() !== value) local.onOpenChange?.(value);
		setOpenRaw(value);
		if (!value) setQuery("");
	};
	const toggle = (v: string) => {
		const current = selected();
		const next = current.includes(v) ? current.filter((i) => i !== v) : [...current, v];
		if (!current.includes(v) && local.maxSelected !== undefined && current.length >= local.maxSelected) return;
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};
	const clear = () => {
		if (local.value === undefined) setInternal([]);
		local.onChange?.([]);
		local.onClear?.();
	};
	const onKeyDown = createMultiSelectKeyHandler({
		open,
		setOpen,
		setActive,
		options: filtered,
		toggle,
		active,
	});
	const onSearchInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		setQuery(e.currentTarget.value);
		setActive(0);
	};
	const onOptionMouseDown = (e: MouseEvent) => e.preventDefault();
	const onOptionKeyDown = (e: KeyboardEvent, option: MultiSelectOption) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (!option.disabled) toggle(option.value);
		}
	};
	const { className, triggerClassName, listClassName, searchClassName } = createMultiSelectClassNames(local);
	const state = {
		local,
		rest,
		open,
		active,
		id,
		listboxId,
		searchId,
		selected,
		selectedOptions,
		filtered,
		className,
		triggerClassName,
		listClassName,
		searchClassName,
	};
	const actions = { setOpen, setActive, toggle, clear, onKeyDown, onSearchInput, onOptionMouseDown, onOptionKeyDown };
	return { state, actions };
}

export type MultiSelectContext = ReturnType<typeof useMultiSelect>;
