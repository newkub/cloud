/**
 * Pagination - numbered page navigation.
 */
import { createSignal, For, type JSX, mergeProps, children as resolveChildren, Show, splitProps } from "solid-js";
import { controlSizes, controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { PaginationContext } from "./pagination/context";
import { PaginationEllipsis } from "./pagination/PaginationEllipsis";
import { PaginationItem } from "./pagination/PaginationItem";
import { PaginationNext } from "./pagination/PaginationNext";
import { PaginationPrevious } from "./pagination/PaginationPrevious";

export type { PaginationItemProps } from "./pagination/PaginationItem";
export { PaginationItem } from "./pagination/PaginationItem";
export type { PaginationNextProps } from "./pagination/PaginationNext";
export { PaginationNext } from "./pagination/PaginationNext";
export type { PaginationPreviousProps } from "./pagination/PaginationPrevious";
export { PaginationPrevious } from "./pagination/PaginationPrevious";

export interface PaginationProps extends JSX.HTMLAttributes<HTMLElement> {
	page?: number;
	defaultPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	variant?: keyof typeof controlVariants;
	size?: keyof typeof controlSizes;
	/** Pages shown around the current page @default 1 */
	siblingCount?: number;
	/** Show numbered page buttons — `false` renders a "Page x of y" readout @default true */
	showNumbers?: boolean;
	/** Disable all controls. */
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function getPaginationRange(page: number, total: number, siblings = 1): (number | "ellipsis")[] {
	const windowSize = 5 + siblings * 2;
	if (total <= windowSize) return Array.from({ length: total }, (_, i) => i + 1);
	const lo = Math.max(2, page - siblings);
	const hi = Math.min(total - 1, page + siblings);
	const range: (number | "ellipsis")[] = [1];
	if (lo > 2) range.push("ellipsis");
	for (let p = lo; p <= hi; p++) range.push(p);
	if (hi < total - 1) range.push("ellipsis");
	range.push(total);
	return range;
}

export function Pagination(props: PaginationProps) {
	const merged = mergeProps({ totalPages: 1, defaultPage: 1 }, props);
	const [internal, setInternal] = createSignal(merged.defaultPage);
	const page = () => props.page ?? internal();
	const totalPages = () => merged.totalPages;
	const setPage = (next: number) => {
		if (next < 1 || next > totalPages()) return;
		setInternal(next);
		props.onPageChange?.(next);
	};

	const isFirst = () => page() === 1;
	const isLast = () => page() === totalPages();

	const [local, rest] = splitProps(props, [
		"class",
		"page",
		"defaultPage",
		"totalPages",
		"onPageChange",
		"children",
		"variant",
		"size",
		"siblingCount",
		"showNumbers",
		"disabled",
		"radius",
		"elevation",
	]);
	const resolved = resolveChildren(() => local.children);
	const range = () => getPaginationRange(page(), totalPages(), local.siblingCount);
	const className = () =>
		[
			"flex items-center gap-1",
			local.variant ? controlVariants[local.variant] : "",
			local.size ? controlSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<PaginationContext.Provider value={{ page, totalPages, setPage }}>
			<nav class={className()} aria-label="pagination" {...rest}>
				<ul class="flex items-center gap-1">
					<Show
						when={resolved()}
						fallback={
							<>
								<PaginationPrevious disabled={isFirst() || local.disabled} />
								<Show
									when={local.showNumbers ?? true}
									fallback={
										<li class="px-3 text-sm text-muted-foreground tabular-nums">
											Page {page()} of {totalPages()}
										</li>
									}
								>
									<For each={range()}>
										{(item) =>
											typeof item === "number" ? (
												<PaginationItem page={item} disabled={local.disabled} />
											) : (
												<PaginationEllipsis />
											)
										}
									</For>
								</Show>
								<PaginationNext disabled={isLast() || local.disabled} />
							</>
						}
					>
						{resolved()}
					</Show>
				</ul>
			</nav>
		</PaginationContext.Provider>
	);
}
