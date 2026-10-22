import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { usePaginationContext } from "./context";

export interface PaginationItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	page: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function PaginationItem(props: PaginationItemProps) {
	const ctx = usePaginationContext("PaginationItem");
	const [local, rest] = splitProps(props, ["class", "page", "children", "onClick", "radius", "elevation"]);

	const active = () => ctx.page() === local.page;
	const className = () => {
		const base =
			"inline-flex h-11 w-11 items-center justify-center border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
		return [
			base,
			active()
				? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
				: "border-input bg-background text-foreground hover:bg-muted hover:text-foreground",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	};

	const onClick = (e: MouseEvent) => {
		ctx.setPage(local.page);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<li>
			<button
				type="button"
				aria-label={`Go to page ${local.page}`}
				aria-current={active() ? "page" : undefined}
				class={className()}
				onClick={onClick}
				{...rest}
			>
				{local.children ?? local.page}
			</button>
		</li>
	);
}
