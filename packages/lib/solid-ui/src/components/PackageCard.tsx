/**
 * PackageCard — package summary card (name, version, downloads, license).
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface PackageCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	name: string;
	version?: string;
	description?: string;
	/** Downloads per week (formatted compactly). */
	downloads?: number;
	license?: string;
	/** Registry label — e.g. "npm", "crates", "jsr". */
	registry?: string;
	href?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const nameSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const fmt = (n: number) =>
	n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export function PackageCard(props: PackageCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"version",
		"description",
		"downloads",
		"license",
		"registry",
		"href",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-package-card ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2">
				<svg
					class="h-4 w-4 shrink-0 text-muted-foreground"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
				>
					<path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" stroke-linejoin="round" />
					<path d="m4 6.5 8 4.5 8-4.5M12 11v11" stroke-linejoin="round" />
				</svg>
				{local.href ? (
					<a
						href={local.href}
						class={`truncate font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${nameSize[local.size ?? "md"]}`}
					>
						{local.name}
					</a>
				) : (
					<span class={`truncate font-semibold text-foreground ${nameSize[local.size ?? "md"]}`}>{local.name}</span>
				)}
				<Show when={local.version}>
					<span class="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-2xs text-primary">
						v{local.version}
					</span>
				</Show>
			</div>
			<Show when={local.description}>
				<p class="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{local.description}</p>
			</Show>
			<div class="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
				<Show when={local.downloads !== undefined}>
					<span class="tabular-nums" title="Weekly downloads">
						{fmt(local.downloads ?? 0)}/wk
					</span>
				</Show>
				<Show when={local.license}>
					<span>{local.license}</span>
				</Show>
				<Show when={local.registry}>
					<span class="ml-auto font-mono text-2xs uppercase text-muted-foreground/70">{local.registry}</span>
				</Show>
			</div>
		</div>
	);
}
