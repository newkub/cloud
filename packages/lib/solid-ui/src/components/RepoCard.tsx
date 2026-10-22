/**
 * RepoCard — repository summary card (name, description, stars, language).
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

export interface RepoCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** owner/name shown in the header. */
	name: string;
	description?: string;
	stars?: number;
	forks?: number;
	/** Primary language — shows a colored dot. */
	language?: string;
	/** Language dot color class, e.g. "bg-warning". @default "bg-info" */
	languageColor?: string;
	/** Issues count chip. */
	issues?: number;
	/** Link wrapping the repo name. */
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
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

export function RepoCard(props: RepoCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"description",
		"stars",
		"forks",
		"language",
		"languageColor",
		"issues",
		"href",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-repo-card ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
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
					<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
					<path d="M4 19a2 2 0 0 1 2-2h13" />
				</svg>
				{local.href ? (
					<a
						href={local.href}
						class={`truncate font-semibold text-primary hover:underline ${nameSize[local.size ?? "md"]}`}
					>
						{local.name}
					</a>
				) : (
					<span class={`truncate font-semibold text-foreground ${nameSize[local.size ?? "md"]}`}>{local.name}</span>
				)}
			</div>
			<Show when={local.description}>
				<p class="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{local.description}</p>
			</Show>
			<div class="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
				<Show when={local.language}>
					<span class="flex items-center gap-1.5">
						<span class={`h-2.5 w-2.5 rounded-full ${local.languageColor ?? "bg-info"}`} />
						{local.language}
					</span>
				</Show>
				<Show when={local.stars !== undefined}>
					<span class="flex items-center gap-1 tabular-nums" title="Stars">
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							aria-hidden="true"
						>
							<path
								d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"
								stroke-linejoin="round"
							/>
						</svg>
						{fmt(local.stars ?? 0)}
					</span>
				</Show>
				<Show when={local.forks !== undefined}>
					<span class="flex items-center gap-1 tabular-nums" title="Forks">
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							aria-hidden="true"
						>
							<circle cx="6" cy="5" r="2.5" />
							<circle cx="18" cy="5" r="2.5" />
							<circle cx="12" cy="19" r="2.5" />
							<path d="M6 7.5V9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.5M12 12v4.5" />
						</svg>
						{fmt(local.forks ?? 0)}
					</span>
				</Show>
				<Show when={local.issues !== undefined}>
					<span class="tabular-nums" title="Open issues">
						{local.issues} issues
					</span>
				</Show>
			</div>
		</div>
	);
}
