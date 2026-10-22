import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../../lib/variants";
import type { ContextMenuItem, ContextMenuProps, ContextMenuRefs } from "./types";

export const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-md",
};

function createContextMenuRefs(): ContextMenuRefs {
	return {};
}

function createContextMenuClassName(localClass?: string) {
	return () =>
		[
			"inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			localClass ?? "",
		]
			.filter(Boolean)
			.join(" ");
}

function useContextMenuPosition() {
	const [pos, setPos] = createSignal({ x: 0, y: 0 });
	const updateFromTrigger = (refs: ContextMenuRefs) => {
		const rect = refs.area?.getBoundingClientRect();
		if (rect) {
			setPos({ x: rect.left, y: rect.bottom });
		}
	};
	return { pos, setPos, updateFromTrigger };
}

function useContextMenuDocumentEffects(refs: ContextMenuRefs, setOpen: (value: boolean) => void) {
	// Composite target covering both the trigger and the portalled menu.
	const menuRoot = () =>
		({
			contains: (node: Node) => !!(refs.area?.contains(node) || refs.content?.contains(node)),
		}) as unknown as HTMLElement;
	useClickOutside(menuRoot, () => setOpen(false), { events: ["mousedown"] });
	useEscapeKey(() => {
		setOpen(false);
		refs.area?.focus();
	});
}

export function useContextMenu(props: ContextMenuProps) {
	const merged = mergeProps({ defaultOpen: false, items: [] as ContextMenuItem[] }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"open",
		"defaultOpen",
		"onOpenChange",
		"items",
		"closeOnSelect",
		"disabled",
		"variant",
		"radius",
		"elevation",
		"children",
		"onContextMenu",
	]);
	const [internal, setInternal] = createSignal(merged.defaultOpen);
	const refs = createContextMenuRefs();
	const { pos, setPos, updateFromTrigger } = useContextMenuPosition();
	const open = () => (local.open !== undefined ? local.open : internal());
	const setOpen = (value: boolean) => {
		setInternal(value);
		local.onOpenChange?.(value);
	};
	useContextMenuDocumentEffects(refs, setOpen);
	const clamp = (p: { x: number; y: number }) => {
		const menuW = 192;
		const menuH = Math.min((local.items ?? []).length * 36 + 16, 320);
		return {
			x: Math.min(p.x, Math.max(8, window.innerWidth - menuW - 8)),
			y: Math.min(p.y, Math.max(8, window.innerHeight - menuH - 8)),
		};
	};
	const onContextMenu: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
		if (local.disabled) return;
		if (typeof local.onContextMenu === "function") {
			local.onContextMenu(e);
		}
		e.preventDefault();
		setPos(clamp({ x: e.clientX, y: e.clientY }));
		setOpen(true);
	};
	const onItemClick = (item: ContextMenuItem) => {
		if (item.disabled || item.separator) return;
		item.onClick?.();
		if (local.closeOnSelect ?? true) setOpen(false);
	};
	const className = createContextMenuClassName(local.class);
	const onTriggerKeyDown = (e: KeyboardEvent) => {
		if (local.disabled) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			updateFromTrigger(refs);
			const rect = refs.area?.getBoundingClientRect();
			if (rect) setPos(clamp({ x: rect.left, y: rect.bottom }));
			setOpen(true);
		}
	};
	return {
		local,
		rest,
		open,
		pos,
		setAreaRef: (el: HTMLButtonElement | undefined) => {
			refs.area = el;
		},
		setContentRef: (el: HTMLDivElement | undefined) => {
			refs.content = el;
		},
		onContextMenu,
		onTriggerKeyDown,
		onItemClick,
		className,
	};
}
