import { type JSX, Show, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { itemVariantClass } from "./constants";
import { MenubarContext } from "./context";

export interface MenubarItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Keyboard shortcut hint rendered at the end. */
	shortcut?: string;
	/** Tone of the item. @default "default" */
	variant?: "default" | "destructive";
	/** Close the menubar popup after selecting. @default true */
	closeOnSelect?: boolean;
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MenubarItem(props: MenubarItemProps) {
	const ctx = useContext(MenubarContext);
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"onClick",
		"icon",
		"shortcut",
		"variant",
		"closeOnSelect",
		"radius",
		"elevation",
	]);

	const className = () =>
		[
			"flex w-full items-center justify-between gap-2 px-2 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			itemVariantClass[local.variant ?? "default"],
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		if (local.closeOnSelect ?? true) {
			ctx?.setValue("");
		}
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button type="button" class={className()} onClick={onClick} role="menuitem" {...rest}>
			<span class="flex min-w-0 items-center gap-2">
				<Show when={local.icon}>
					<span class="inline-flex shrink-0 items-center" aria-hidden="true">
						{local.icon}
					</span>
				</Show>
				<span class="truncate">{local.children}</span>
			</span>
			<Show when={local.shortcut}>
				<kbd class="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-xs opacity-80">
					{local.shortcut}
				</kbd>
			</Show>
		</button>
	);
}
