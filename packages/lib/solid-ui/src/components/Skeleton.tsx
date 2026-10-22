/**
 * Loading skeleton placeholder — `shape` picks rect (default), `circle`
 * (fixed px size), `text` (staggered lines) or `card` (media + lines + avatar).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap = {
	default: "bg-muted",
	primary: "bg-primary/20",
	secondary: "bg-secondary",
	muted: "bg-muted",
} as const;

const sizeMap = {
	sm: "h-2",
	md: "h-4",
	lg: "h-6",
} as const;

const mediaH = { sm: "h-20", md: "h-28", lg: "h-36" } as const;
const textWidths = ["w-full", "w-5/6", "w-4/5", "w-3/4", "w-2/3", "w-1/2"];

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Placeholder shape @default "rect" */
	shape?: "rect" | "text" | "circle" | "card";
	/** Fill tone @default "default" */
	variant?: keyof typeof variantMap;
	/** Bar height preset (rect/card) @default "md" */
	size?: keyof typeof sizeMap;
	/** Fixed px size for `shape="circle"` @default 48 */
	px?: number;
	/** Line count for `shape="text"`/`"card"` @default 3 */
	lines?: number;
	/** Media block for `shape="card"` @default true */
	media?: boolean;
	/** Avatar circle for `shape="card"` @default false */
	avatar?: boolean;
	/** Accessible loading label */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Skeleton(props: SkeletonProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"style",
		"shape",
		"variant",
		"size",
		"px",
		"lines",
		"media",
		"avatar",
		"label",
		"radius",
		"elevation",
	]);
	const extras = () =>
		`${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`.trim();

	if (local.shape === "circle") {
		const size = local.px ?? 48;
		return (
			<div
				class={`motion-safe:animate-pulse ${variantMap[local.variant ?? "default"]} ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
				style={{ width: `${size}px`, height: `${size}px`, ...(local.style as JSX.CSSProperties) }}
				role="status"
				aria-busy="true"
				aria-label={local.label ?? "Loading"}
				{...rest}
			/>
		);
	}

	if (local.shape === "text") {
		return (
			<div
				class={`w-full space-y-2 ${local.class ?? ""}`.trim()}
				role="status"
				aria-busy="true"
				aria-label={local.label ?? "Loading text"}
				{...rest}
			>
				<For each={Array.from({ length: local.lines ?? 3 })}>
					{(_, i) => (
						<div
							class={`h-2 motion-safe:animate-pulse rounded ${variantMap[local.variant ?? "default"]} ${textWidths[i() % textWidths.length]}`}
						/>
					)}
				</For>
			</div>
		);
	}

	if (local.shape === "card") {
		const count = () => Math.max(1, local.lines ?? 3);
		return (
			<div
				role="status"
				class={`overflow-hidden rounded-lg border border-border bg-surface ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<span class="sr-only">{local.label ?? "Loading"}</span>
				<Show when={local.media ?? true}>
					<div
						class={`motion-safe:animate-pulse bg-muted ${mediaH[local.size ?? "md"]} ${extras()}`}
						aria-hidden="true"
					/>
				</Show>
				<div class="flex items-start gap-3 p-4" aria-hidden="true">
					<Show when={local.avatar}>
						<div class="h-10 w-10 shrink-0 rounded-full bg-muted motion-safe:animate-pulse" />
					</Show>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<div class="h-3 w-1/2 motion-safe:animate-pulse rounded bg-muted" />
						<For each={Array.from({ length: count() }, (_, i) => i)}>
							{(i) => (
								<div
									class={`h-2.5 motion-safe:animate-pulse rounded bg-muted ${i === count() - 1 ? "w-2/3" : "w-full"}`}
									style={{ "animation-delay": `${i * 120}ms` }}
								/>
							)}
						</For>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			class={`w-full motion-safe:animate-pulse ${variantMap[local.variant ?? "default"]} ${sizeMap[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			style={local.style as JSX.CSSProperties}
			aria-hidden="true"
			{...rest}
		/>
	);
}
