import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { usePaginationContext } from "./context";
import { PaginationChevronLeft } from "./PaginationIcons";

export interface PaginationPreviousProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function PaginationPrevious(props: PaginationPreviousProps) {
	const ctx = usePaginationContext("PaginationPrevious");
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "disabled", "radius", "elevation"]);

	const disabled = () => local.disabled || ctx.page() === 1;
	const className = () =>
		[
			"inline-flex h-11 items-center justify-center gap-1 border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		if (!disabled()) ctx.setPage(ctx.page() - 1);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<li>
			<button
				type="button"
				aria-label="Go to previous page"
				class={className()}
				disabled={disabled()}
				onClick={onClick}
				{...rest}
			>
				<Show
					when={local.children}
					fallback={
						<>
							<PaginationChevronLeft />
							<span class="sr-only">Previous</span>
						</>
					}
				>
					{local.children}
				</Show>
			</button>
		</li>
	);
}
