/**
 * BarList — horizontal labelled bars (ranked list visualisation).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BarListItem {
	label: string;
	value: number;
	/** Bar color — defaults to primary */
	color?: string;
	href?: string;
}

export interface BarListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: BarListItem[];
	/** Bar tone @default "primary" */
	variant?: "primary" | "info" | "success" | "warning";
	/** Bar height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Show values on the right @default true */
	showValues?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const barH = { sm: "h-5", md: "h-7", lg: "h-9" } as const;
const barColor = {
	primary: "bg-primary/80",
	info: "bg-info/80",
	success: "bg-success/80",
	warning: "bg-warning/80",
} as const;

export function BarList(props: BarListProps) {
	const [local, rest] = splitProps(props, ["class", "items", "variant", "size", "showValues", "radius", "elevation"]);
	const max = () => Math.max(1, ...(local.items ?? []).map((i) => i.value));
	return (
		<div class={`solidui-bar-list space-y-1.5 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.items ?? []}>
				{(item) => {
					const inner = (
						<>
							<div
								class={`${barH[local.size ?? "md"]} transition-all motion-reduce:transition-none ${item.color ? "" : barColor[local.variant ?? "primary"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
								style={{
									width: `${(item.value / max()) * 100}%`,
									...(item.color ? { "background-color": item.color } : {}),
								}}
							/>
							<div class="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-xs">
								<span class="truncate font-medium text-foreground mix-blend-difference">{item.label}</span>
								{(local.showValues ?? true) ? <span class="font-mono text-muted-foreground">{item.value}</span> : null}
							</div>
						</>
					);
					return item.href ? (
						<a
							href={item.href}
							class="group relative block rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							{inner}
						</a>
					) : (
						<div class="group relative">{inner}</div>
					);
				}}
			</For>
		</div>
	);
}
