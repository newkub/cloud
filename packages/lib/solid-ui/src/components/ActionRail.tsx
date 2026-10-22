/**
 * ActionRail — slim vertical icon rail with an active indicator and badge dots.
 * @deprecated Use `NavigationRail` with `showLabels={false}` — it also supports
 * count badges, an expanded mode and radius/elevation.
 */
import { type JSX, splitProps } from "solid-js";
import { NavigationRail } from "./NavigationRail";

export interface ActionRailItem {
	/** Icon (JSX or glyph) — the only thing visible in the rail. */
	icon: JSX.Element;
	/** Accessible name — shown as a tooltip via `title`. */
	label: string;
	/** Show a notification dot on the icon. @default false */
	badge?: boolean;
	/** Optional link target — renders an anchor instead of a button. */
	href?: string;
}

export interface ActionRailProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onChange"> {
	/** Rail items, rendered top-to-bottom. */
	items: ActionRailItem[];
	/** Label of the active item. */
	value?: string;
	/** Called with the item label when a button item is clicked. */
	onChange?: (label: string) => void;
	/** Rail accessible name. @default "Actions" */
	"aria-label"?: string;
}

export function ActionRail(props: ActionRailProps) {
	const [local, rest] = splitProps(props, ["items", "value", "onChange", "aria-label", "onSelect"]);
	return (
		<NavigationRail
			items={(local.items ?? []).map((item) => ({
				id: item.label,
				label: item.label,
				icon: item.icon,
				href: item.href,
				badge: item.badge,
			}))}
			active={local.value}
			onSelect={(id) => local.onChange?.(id)}
			showLabels={false}
			aria-label={local["aria-label"] ?? "Actions"}
			{...rest}
		/>
	);
}
