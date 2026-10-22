/**
 * PropertyList — definition-list rows (term + description).
 * `layout`: "split" = label column (default), "table" = bordered two-column
 * card with right-aligned values, "grid" = plain stacked rows.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface PropertyItem {
	/** Term/label — `key` also accepted via `key` for table-style callers */
	term?: string;
	/** Value/description — `value` also accepted */
	description?: JSX.Element;
	/** Alias of `term` */
	key?: string;
	/** Alias of `description` */
	value?: JSX.Element;
	/** Trailing icon before the term */
	icon?: JSX.Element;
	/** Render the value in monospace */
	mono?: boolean;
}

export interface PropertyListProps extends JSX.HTMLAttributes<HTMLDListElement> {
	items?: PropertyItem[];
	/** Row layout @default "split" */
	layout?: "split" | "table" | "grid";
	/** Label column width (split layout) @default "md" */
	labelWidth?: "sm" | "md" | "lg";
	/** Row density @default "md" */
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Table-layout row tone @default "muted" */
	variant?: "muted" | "striped";
	/** Bordered card chrome — defaults on for "table", off otherwise */
	bordered?: boolean;
	/** Render `children` rows instead of `items` */
	children?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const widthClass = { sm: "sm:w-24", md: "sm:w-36", lg: "sm:w-48" } as const;
const rowSize = {
	xs: "py-1 text-xs",
	sm: "py-1.5 text-xs",
	md: "py-2 text-sm",
	lg: "py-3 text-sm",
	xl: "py-4 text-base",
} as const;
const tableRowSize = {
	xs: "px-2 py-1 text-2xs",
	sm: "px-2 py-1 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-4 py-2.5 text-sm",
	xl: "px-4 py-3 text-base",
} as const;

export function PropertyList(props: PropertyListProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"layout",
		"labelWidth",
		"size",
		"variant",
		"bordered",
		"children",
		"radius",
		"elevation",
	]);
	const term = (item: PropertyItem) => item.term ?? item.key;
	const desc = (item: PropertyItem) => item.description ?? item.value;
	const layout = () => local.layout ?? "split";
	const bordered = () => local.bordered ?? layout() === "table";
	const size = () => local.size ?? "md";

	return (
		<Show
			when={layout() === "table"}
			fallback={
				<Show
					when={layout() === "grid"}
					fallback={
						<dl
							class={`solidui-property-list ${bordered() ? `overflow-hidden rounded-lg border border-border ${surfaceVariants[local.variant === "striped" ? "default" : "default"]}` : "divide-y divide-border"} ${local.class ?? ""}`.trim()}
							{...rest}
						>
							<Show
								when={local.children}
								fallback={
									<For each={local.items}>
										{(item) => (
											<div
												class={`flex flex-col gap-1 sm:flex-row sm:gap-4 ${rowSize[size()]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${bordered() ? "px-4" : ""}`}
											>
												<dt
													class={`flex items-center gap-1.5 font-medium text-muted-foreground sm:shrink-0 ${widthClass[local.labelWidth ?? "md"]}`}
												>
													{item.icon}
													{term(item)}
												</dt>
												<dd class={`min-w-0 flex-1 text-foreground ${item.mono ? "font-mono" : ""}`}>{desc(item)}</dd>
											</div>
										)}
									</For>
								}
							>
								{local.children}
							</Show>
						</dl>
					}
				>
					<dl
						class={`solidui-property-list grid gap-2 text-sm ${local.variant ? surfaceVariants.default : ""} ${paddingSizes[size() === "xs" ? "sm" : size()]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
						{...rest}
					>
						<For each={local.items}>
							{(item) => (
								<div class="flex items-baseline gap-2">
									<dt class="shrink-0 font-medium text-muted-foreground">{term(item)}</dt>
									<dd class={`min-w-0 text-foreground ${item.mono ? "font-mono" : ""}`}>{desc(item)}</dd>
								</div>
							)}
						</For>
						{local.children}
					</dl>
				</Show>
			}
		>
			<dl
				class={`solidui-property-list overflow-hidden rounded-lg border border-border ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<For each={local.items}>
					{(item, i) => (
						<div
							class={`flex items-center justify-between gap-4 border-b border-border last:border-0 ${tableRowSize[size()]} ${
								local.variant === "striped" && i() % 2 ? "bg-muted/30" : "bg-surface"
							} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`}
						>
							<dt class="flex shrink-0 items-center gap-1.5 font-medium text-muted-foreground">
								{item.icon}
								{term(item)}
							</dt>
							<dd class={`min-w-0 truncate text-right text-foreground ${item.mono ? "font-mono" : ""}`}>
								{desc(item)}
							</dd>
						</div>
					)}
				</For>
				{local.children}
			</dl>
		</Show>
	);
}
