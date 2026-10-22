/**
 * ErDiagram — entity boxes with attribute rows connected by labelled relations.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ErEntity {
	/** Entity name shown in the header row */
	name: string;
	/** Attribute names listed under the header */
	attributes: string[];
}

export interface ErRelation {
	/** Source entity name */
	from: string;
	/** Target entity name */
	to: string;
	/** Cardinality label, e.g. "1:N" */
	label?: string;
}

export interface ErDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	entities: ErEntity[];
	relations?: ErRelation[];
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" } as const;
const ENT_W = 150;
const ROW_H = 20;
const HEAD_H = 28;
const GAP = 60;
const PAD = 16;

export function ErDiagram(props: ErDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "entities", "relations", "size", "radius", "elevation"]);
	const entities = () => local.entities ?? [];
	const pos = (i: number, rowCount: number) => {
		const perRow = Math.max(1, Math.ceil(Math.sqrt(entities().length)));
		const col = i % perRow;
		const row = Math.floor(i / perRow);
		return { x: PAD + col * (ENT_W + GAP), y: PAD + row * (HEAD_H + rowCount * ROW_H + GAP), col, row };
	};
	const entityBox = (name: string) => {
		const idx = entities().findIndex((e) => e.name === name);
		if (idx < 0) return null;
		const e = entities()[idx];
		const p = pos(idx, e.attributes.length);
		return { x: p.x, y: p.y, w: ENT_W, h: HEAD_H + e.attributes.length * ROW_H };
	};
	const width = () => Math.max(0, ...entities().map((e, i) => pos(i, e.attributes.length).x + ENT_W)) + PAD;
	const height = () =>
		Math.max(0, ...entities().map((e, i) => pos(i, e.attributes.length).y + HEAD_H + e.attributes.length * ROW_H)) +
		PAD;
	return (
		<div
			class={`solidui-er-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${width()} ${height()}`}
				class="h-auto w-full"
				role="img"
				aria-label={`ER diagram: ${entities()
					.map((e) => e.name)
					.join(", ")}`}
			>
				<For each={local.relations ?? []}>
					{(r) => {
						const a = entityBox(r.from);
						const b = entityBox(r.to);
						if (!a || !b) return null;
						const ax = a.x + a.w / 2;
						const ay = a.y + a.h / 2;
						const bx = b.x + b.w / 2;
						const by = b.y + b.h / 2;
						return (
							<g>
								<line x1={ax} y1={ay} x2={bx} y2={by} class="stroke-muted-foreground" stroke-width="1.5" />
								{r.label ? (
									<text
										x={(ax + bx) / 2}
										y={(ay + by) / 2 - 4}
										text-anchor="middle"
										class="fill-muted-foreground"
										font-size="10"
									>
										{r.label}
									</text>
								) : null}
							</g>
						);
					}}
				</For>
				<For each={entities()}>
					{(e, i) => {
						const p = () => pos(i(), e.attributes.length);
						return (
							<g>
								<rect
									x={p().x}
									y={p().y}
									width={ENT_W}
									height={HEAD_H + e.attributes.length * ROW_H}
									rx={6}
									class="fill-surface stroke-border"
									stroke-width="1.5"
								/>
								<rect x={p().x} y={p().y} width={ENT_W} height={HEAD_H} rx={6} class="fill-primary/10" />
								<text
									x={p().x + ENT_W / 2}
									y={p().y + HEAD_H / 2}
									dy="0.35em"
									text-anchor="middle"
									class="fill-foreground"
									font-size="11"
									font-weight="600"
								>
									{e.name}
								</text>
								<For each={e.attributes}>
									{(attr, j) => (
										<text
											x={p().x + 8}
											y={p().y + HEAD_H + j() * ROW_H + ROW_H / 2}
											dy="0.35em"
											class="fill-muted-foreground"
											font-size="10"
										>
											{attr}
										</text>
									)}
								</For>
							</g>
						);
					}}
				</For>
			</svg>
		</div>
	);
}
