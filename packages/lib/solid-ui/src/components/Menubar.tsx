/**
 * Horizontal menu bar
 */
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { createMenubarId, variantMap } from "./menubar/constants";
import { MenubarContext } from "./menubar/context";

export type { MenubarContentProps } from "./menubar/MenubarContent";
export { MenubarContent } from "./menubar/MenubarContent";
export type { MenubarGroupProps } from "./menubar/MenubarGroup";
export { MenubarGroup } from "./menubar/MenubarGroup";
export type { MenubarItemProps } from "./menubar/MenubarItem";
export { MenubarItem } from "./menubar/MenubarItem";
export type { MenubarLabelProps } from "./menubar/MenubarLabel";
export { MenubarLabel } from "./menubar/MenubarLabel";
export type { MenubarMenuProps } from "./menubar/MenubarMenu";
export { MenubarMenu } from "./menubar/MenubarMenu";
export type { MenubarSeparatorProps } from "./menubar/MenubarSeparator";
export { MenubarSeparator } from "./menubar/MenubarSeparator";
export type { MenubarTriggerProps } from "./menubar/MenubarTrigger";
export { MenubarTrigger } from "./menubar/MenubarTrigger";

export interface MenubarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Menubar(props: MenubarProps) {
	const merged = mergeProps({ defaultValue: "" }, props);
	const [local, rest] = splitProps(merged, ["class", "value", "defaultValue", "onValueChange", "variant", "children"]);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const value = () => (local.value !== undefined ? local.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		local.onValueChange?.(next);
	};
	const baseId = createMenubarId();

	const className = () =>
		[
			"flex items-center gap-1 border p-1",
			variantMap[local.variant ?? "default"],
			radiusMap[merged.radius ?? "lg"],
			merged.elevation ? elevationMap[merged.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		if (e.key === "Escape") {
			const trigger = e.currentTarget.querySelector<HTMLElement>('[aria-expanded="true"]');
			setValue("");
			trigger?.focus();
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const target = e.target as HTMLElement;
			if (target.getAttribute("aria-haspopup") !== "menu") return;
			const triggers = Array.from(
				e.currentTarget.querySelectorAll<HTMLButtonElement>('[aria-haspopup="menu"]:not([disabled])'),
			);
			const idx = triggers.indexOf(target as HTMLButtonElement);
			if (idx === -1) return;
			e.preventDefault();
			const next = triggers[(idx + (e.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length];
			next.focus();
			if (value()) next.click();
		}
	};

	return (
		<MenubarContext.Provider value={{ value, setValue, baseId }}>
			<div class={className()} role="menubar" onKeyDown={onKeyDown} {...rest}>
				{local.children}
			</div>
		</MenubarContext.Provider>
	);
}
