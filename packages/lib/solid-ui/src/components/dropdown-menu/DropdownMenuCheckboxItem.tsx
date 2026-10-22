import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { useDropdownMenuContext } from "./context";

export interface DropdownMenuCheckboxItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Checked state. */
	checked?: boolean;
	/** Called with the next checked state when toggled. */
	onCheckedChange?: (checked: boolean) => void;
	/** Close the menu after toggling. @default true */
	closeOnSelect?: boolean;
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"onClick",
		"checked",
		"onCheckedChange",
		"closeOnSelect",
		"radius",
		"elevation",
	]);
	const ctx = useDropdownMenuContext("DropdownMenu.CheckboxItem");

	const className = () =>
		[
			"flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-50",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		local.onCheckedChange?.(!local.checked);
		if (local.closeOnSelect ?? ctx.closeOnSelect()) {
			ctx.setOpen(false);
		}
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button
			type="button"
			class={className()}
			onClick={onClick}
			role="menuitemcheckbox"
			aria-checked={local.checked ?? false}
			{...rest}
		>
			<span class="inline-flex w-4 shrink-0 items-center justify-center" aria-hidden="true">
				{local.checked ? "✓" : ""}
			</span>
			<span class="min-w-0 flex-1 truncate">{local.children}</span>
		</button>
	);
}
