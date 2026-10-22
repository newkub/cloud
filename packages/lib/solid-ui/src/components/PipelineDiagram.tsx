/**
 * PipelineDiagram — CI/CD-style stages, each with sequential steps.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PipelineStage {
	/** Stage name */
	name: string;
	/** Steps inside the stage */
	steps: string[];
	/** Stage status drives the accent tone @default "default" */
	status?: "default" | "success" | "warning" | "destructive" | "info";
}

export interface PipelineDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stages: PipelineStage[];
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;
const statusTone: Record<NonNullable<PipelineStage["status"]>, string> = {
	default: "fill-surface stroke-border",
	success: "fill-success/10 stroke-success/50",
	warning: "fill-warning/10 stroke-warning/50",
	destructive: "fill-destructive/10 stroke-destructive/50",
	info: "fill-info/10 stroke-info/50",
};
const statusText: Record<NonNullable<PipelineStage["status"]>, string> = {
	default: "fill-foreground",
	success: "fill-success",
	warning: "fill-warning",
	destructive: "fill-destructive",
	info: "fill-info",
};

const STAGE_W = 150;
const STEP_H = 34;
const STEP_GAP = 8;
const HEAD_H = 26;
const COL_GAP = 44;
const PAD = 16;

export function PipelineDiagram(props: PipelineDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "stages", "size", "radius", "elevation"]);
	const colH = (s: PipelineStage) => HEAD_H + s.steps.length * (STEP_H + STEP_GAP);
	const stages = () => local.stages ?? [];
	const width = () => stages().length * (STAGE_W + COL_GAP) - COL_GAP + PAD * 2;
	const height = () => Math.max(0, ...stages().map(colH)) + PAD * 2;
	return (
		<div
			class={`solidui-pipeline-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${width()} ${height()}`}
				class="h-auto w-full"
				role="img"
				aria-label={`Pipeline diagram: stages ${stages()
					.map((s) => s.name)
					.join(", ")}`}
			>
				<For each={stages()}>
					{(stage, i) => {
						const x = () => PAD + i() * (STAGE_W + COL_GAP);
						return (
							<g>
								<text
									x={x() + STAGE_W / 2}
									y={PAD + 12}
									text-anchor="middle"
									class={`${statusText[stage.status ?? "default"]}`}
									font-size="11"
									font-weight="600"
								>
									{stage.name}
								</text>
								<For each={stage.steps}>
									{(step, j) => {
										const y = () => PAD + HEAD_H + j() * (STEP_H + STEP_GAP);
										return (
											<g>
												<rect
													x={x()}
													y={y()}
													width={STAGE_W}
													height={STEP_H}
													rx={6}
													class={statusTone[stage.status ?? "default"]}
													stroke-width="1.5"
												/>
												<text
													x={x() + STAGE_W / 2}
													y={y() + STEP_H / 2}
													dy="0.35em"
													text-anchor="middle"
													class="fill-foreground"
													font-size="11"
												>
													{step}
												</text>
											</g>
										);
									}}
								</For>
								{i() < stages().length - 1 ? (
									<line
										x1={x() + STAGE_W}
										y1={PAD + HEAD_H + STEP_H / 2}
										x2={x() + STAGE_W + COL_GAP}
										y2={PAD + HEAD_H + STEP_H / 2}
										class="stroke-muted-foreground"
										stroke-width="1.5"
										marker-end="url(#su-pipe-arrow)"
									/>
								) : null}
							</g>
						);
					}}
				</For>
				<defs>
					<marker id="su-pipe-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
					</marker>
				</defs>
			</svg>
		</div>
	);
}
