import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { TabsListContext } from "./context";

export interface TabsListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** `pills` renders a muted segmented bar; `underline` renders a flat border-bottom bar. */
	variant?: "pills" | "underline";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TabsList(props: TabsListProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "children", "onKeyDown", "radius", "elevation"]);
	const variant = () => local.variant ?? "pills";
	const className = () =>
		[
			variant() === "underline"
				? "flex gap-1 overflow-x-auto border-b border-border"
				: "flex gap-1 overflow-x-auto rounded-lg bg-muted p-1",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (e.defaultPrevented) return;
		const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
		if (tabs.length === 0) return;
		const currentIndex = tabs.indexOf(e.target as HTMLButtonElement);
		if (currentIndex === -1) return;
		let nextIndex = -1;
		if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
		else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
		else if (e.key === "Home") nextIndex = 0;
		else if (e.key === "End") nextIndex = tabs.length - 1;
		if (nextIndex === -1) return;
		e.preventDefault();
		const next = tabs[nextIndex];
		next.focus();
		next.click();
	};

	return (
		<TabsListContext.Provider value={variant}>
			<div class={className()} role="tablist" onKeyDown={onKeyDown} {...rest}>
				{local.children}
			</div>
		</TabsListContext.Provider>
	);
}
