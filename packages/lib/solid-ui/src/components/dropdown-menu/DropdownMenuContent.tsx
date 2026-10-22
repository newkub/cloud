import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { type MenuAlign, type MenuSide, useDropdownMenuContext } from "./context";
import { alignClassHorizontal, alignClassVertical, sideClass, sideOffsetStyle, variantMap } from "./styles";

export interface DropdownMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Side of the trigger the menu opens on. @default "bottom" */
	side?: MenuSide;
	/** Alignment along the trigger. @default "start" */
	align?: MenuAlign;
	/** Distance in px from the trigger. @default 8 */
	sideOffset?: number;
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DropdownMenuContent(props: DropdownMenuContentProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"side",
		"align",
		"sideOffset",
		"radius",
		"elevation",
		"style",
	]);
	const ctx = useDropdownMenuContext("DropdownMenu.Content");

	const side = () => local.side ?? "bottom";
	const align = () => local.align ?? "start";
	const alignClass = () =>
		side() === "top" || side() === "bottom" ? alignClassVertical[align()] : alignClassHorizontal[align()];
	const offsetStyle = (): JSX.CSSProperties | string => {
		const offset = `${local.sideOffset ?? 8}px`;
		const prop = sideOffsetStyle[side()];
		if (typeof local.style === "string") return `${local.style}; ${prop}: ${offset}`;
		return { ...(local.style as JSX.CSSProperties), [prop]: offset };
	};

	const className = () =>
		[
			"absolute z-popover w-48 max-w-[calc(100vw-1rem)] border p-1 motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			sideClass[side()],
			alignClass(),
			variantMap[ctx.variant() ?? "default"],
			radiusMap[local.radius ?? "xl"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		if (e.key === "Escape") {
			e.preventDefault();
			ctx.setOpen(false);
			ctx.trigger()?.focus();
			return;
		}
		const items = Array.from(
			e.currentTarget.querySelectorAll<HTMLElement>(
				'[role="menuitem"]:not([disabled]):not([data-disabled]), [role="menuitemcheckbox"]:not([disabled]):not([data-disabled])',
			),
		);
		if (items.length === 0) return;
		const idx = items.indexOf(e.target as HTMLElement);
		let next = -1;
		if (e.key === "ArrowDown") next = idx === -1 ? 0 : (idx + 1) % items.length;
		else if (e.key === "ArrowUp") next = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = items.length - 1;
		if (next === -1) return;
		e.preventDefault();
		items[next].focus();
	};

	return (
		<Show when={ctx.open()}>
			<div
				class={className()}
				style={offsetStyle()}
				ref={ctx.setContent}
				role="menu"
				data-state="open"
				data-side={side()}
				data-align={align()}
				onKeyDown={onKeyDown}
				{...rest}
			>
				{local.children}
			</div>
		</Show>
	);
}
