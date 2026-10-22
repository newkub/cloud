/**
 * MatrixDiagram — 2x2 quadrant chart with axis labels and plotted item dots.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface MatrixQuadrant {
	/** Quadrant title. */
	label: string;
	/** Secondary description line. */
	desc?: string;
}

export interface MatrixItem {
	/** Dot label. */
	label: string;
	/** Horizontal position, 0 (left) to 1 (right). */
	x: number;
	/** Vertical position, 0 (bottom) to 1 (top). */
	y: number;
}

export interface MatrixDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Horizontal axis label. */
	xLabel: string;
	/** Vertical axis label. */
	yLabel: string;
	/** Quadrant content — up to 4 entries ordered top-left, top-right, bottom-left, bottom-right. */
	quadrants?: MatrixQuadrant[];
	/** Items plotted as dots — x/y are clamped to 0..1. */
	items?: MatrixItem[];
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
}

const sizeClass = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" } as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function MatrixDiagram(props: MatrixDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "xLabel", "yLabel", "quadrants", "items", "size", "aria-label"]);
	const quadrants = () => (local.quadrants ?? []).slice(0, 4);
	const items = () => local.items ?? [];
	const label = () => local["aria-label"] ?? `Matrix diagram: ${local.xLabel} vs ${local.yLabel}`;

	return (
		<div class={`solidui-matrix-diagram ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			{/* biome-ignore lint/a11y/useSemanticElements: generic quadrant group, not a form fieldset */}
			<div class="flex items-stretch gap-2" role="group" aria-label={label()}>
				<div class="flex items-center">
					<span
						class="whitespace-nowrap text-muted-foreground text-xs"
						style={{ "writing-mode": "vertical-rl", transform: "rotate(180deg)" }}
					>
						{local.yLabel}
					</span>
				</div>
				<div class="min-w-0 flex-1">
					<div class="relative">
						<div class="grid aspect-square grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
							<For each={quadrants()}>
								{(q) => (
									<div class="flex flex-col justify-center bg-surface p-3">
										<div class="font-medium text-foreground text-sm">{q.label}</div>
										<Show when={q.desc}>
											<div class="text-muted-foreground text-xs">{q.desc}</div>
										</Show>
									</div>
								)}
							</For>
							<Show when={quadrants().length < 4}>
								<For each={Array.from({ length: 4 - quadrants().length })}>{() => <div class="bg-surface" />}</For>
							</Show>
						</div>
						<For each={items()}>
							{(it) => (
								<div
									class="absolute -translate-x-1/2 -translate-y-1/2"
									style={{ left: `${clamp(it.x) * 100}%`, top: `${(1 - clamp(it.y)) * 100}%` }}
								>
									<div class="size-2.5 rounded-full bg-primary ring-2 ring-surface" />
									<div class="mt-0.5 -translate-x-1/4 whitespace-nowrap text-2xs text-foreground">{it.label}</div>
								</div>
							)}
						</For>
					</div>
					<div class="mt-1.5 text-center text-muted-foreground text-xs">{local.xLabel}</div>
				</div>
			</div>
		</div>
	);
}
