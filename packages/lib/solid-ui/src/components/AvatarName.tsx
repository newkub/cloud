/**
 * AvatarName — avatar image/fallback with name and subtitle row.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AvatarNameProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Avatar image URL — falls back to initials */
	src?: string;
	/** Primary name */
	name: string;
	/** Secondary line (email, role…), */
	subtitle?: string;
	/** Avatar size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Stack vertically instead of a row @default false */
	stacked?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const imgSize = { sm: "h-7 w-7 text-2xs", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" } as const;

export function AvatarName(props: AvatarNameProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"src",
		"name",
		"subtitle",
		"size",
		"stacked",
		"radius",
		"elevation",
	]);
	const initials = () =>
		(local.name ?? "")
			.split(/\s+/)
			.map((p) => p.charAt(0).toUpperCase())
			.slice(0, 2)
			.join("");
	return (
		<div
			class={`solidui-avatar-name flex ${local.stacked ? "flex-col items-center text-center" : "items-center"} gap-2.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.src ? (
				<img
					src={local.src}
					alt=""
					class={`${imgSize[local.size ?? "md"]} shrink-0 object-cover ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
				/>
			) : (
				<span
					aria-hidden="true"
					class={`${imgSize[local.size ?? "md"]} flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary`}
				>
					{initials()}
				</span>
			)}
			<div class="min-w-0">
				<p class="truncate text-sm font-medium text-foreground">{local.name}</p>
				<Show when={local.subtitle}>
					<p class="truncate text-xs text-muted-foreground">{local.subtitle}</p>
				</Show>
			</div>
		</div>
	);
}
