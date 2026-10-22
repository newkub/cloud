/**
 * LogoCloud — grayscale row/grid of partner or tool logos.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LogoItem {
	/** Brand name — used as alt/fallback text */
	name: string;
	/** Logo image URL — falls back to the name text */
	src?: string;
	href?: string;
}

export interface LogoCloudProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: LogoItem[];
	/** Optional heading above the row */
	title?: string;
	/** Logo height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const hClass = { sm: "h-6", md: "h-8", lg: "h-10" } as const;

export function LogoCloud(props: LogoCloudProps) {
	const [local, rest] = splitProps(props, ["class", "items", "title", "size", "radius", "elevation"]);
	return (
		<div class={`solidui-logo-cloud space-y-3 ${local.class ?? ""}`.trim()} {...rest}>
			{local.title ? (
				<p class="text-center text-2xs font-semibold uppercase tracking-wider text-muted-foreground">{local.title}</p>
			) : null}
			<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
				<For each={local.items}>
					{(item) => {
						const content = item.src ? (
							<img
								src={item.src}
								alt={item.name}
								class={`${hClass[local.size ?? "md"]} w-auto object-contain opacity-60 grayscale transition motion-reduce:transition-none hover:opacity-100 hover:grayscale-0 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`}
							/>
						) : (
							<span class="text-sm font-semibold text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground">
								{item.name}
							</span>
						);
						return item.href ? (
							<a
								href={item.href}
								aria-label={item.name}
								class="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								{content}
							</a>
						) : (
							content
						);
					}}
				</For>
			</div>
		</div>
	);
}
