/**
 * CompareCard — side-by-side comparison of two entities over shared fields.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CompareField {
	key: string;
	label: string;
	/** Which side wins this field — highlights that cell. */
	winner?: "left" | "right";
}

export interface CompareCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	left: { title: string; subtitle?: string; values: Record<string, JSX.Element> };
	right: { title: string; subtitle?: string; values: Record<string, JSX.Element> };
	fields: CompareField[];
	/** Overall verdict footer. */
	verdict?: JSX.Element;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function CompareCard(props: CompareCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"left",
		"right",
		"fields",
		"verdict",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const side_ = (side: "left" | "right") => (side === "left" ? local.left : local.right) ?? { title: "", values: {} };
	const cell = (side: "left" | "right", field: CompareField) => (
		<div
			class={`min-w-0 py-2 text-center ${textSize[local.size ?? "md"]} ${field.winner === side ? "font-semibold text-success" : "text-foreground"}`}
		>
			{side_(side).values[field.key]}
			<Show when={field.winner === side}>
				<svg
					class="ml-1 inline h-3 w-3"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					aria-hidden="true"
				>
					<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</Show>
		</div>
	);
	const header = (side: "left" | "right") => {
		const s = side_(side);
		return (
			<div class="min-w-0 py-3 text-center">
				<div class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>{s.title}</div>
				<Show when={s.subtitle}>
					<div class="text-2xs text-muted-foreground">{s.subtitle}</div>
				</Show>
			</div>
		);
	};
	return (
		<div
			class={`solidui-compare-card overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch ${pad[local.size ?? "md"]} pb-0`}>
				{header("left")}
				<div class="flex items-center justify-center px-3">
					<span class="rounded-full border border-border px-2 py-0.5 text-2xs font-bold text-muted-foreground">VS</span>
				</div>
				{header("right")}
			</div>
			<div class={`${pad[local.size ?? "md"]} pt-0`}>
				<For each={local.fields ?? []}>
					{(f, i) => (
						<div
							class={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 ${i() > 0 ? "border-t border-border/50" : ""}`}
						>
							{cell("left", f)}
							<div
								class={`w-16 text-center text-muted-foreground sm:w-24 ${local.size === "sm" ? "text-2xs" : "text-2xs"}`}
							>
								{f.label}
							</div>
							{cell("right", f)}
						</div>
					)}
				</For>
			</div>
			<Show when={local.verdict}>
				<div
					class={`border-t border-border bg-muted/20 text-center ${pad[local.size ?? "md"]} ${textSize[local.size ?? "md"]}`}
				>
					{local.verdict}
				</div>
			</Show>
		</div>
	);
}
