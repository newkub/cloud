/**
 * ClassDiagram — UML class boxes with name/attributes/methods compartments.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface UmlClass {
	name: string;
	attributes?: string[];
	methods?: string[];
}

export interface ClassDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	classes?: UmlClass[];
	/** Inheritance/association links as [fromIndex, toIndex, label?]. */
	links?: [number, number, string?][];
	/** Max columns per row. @default 3 */
	columns?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ClassDiagram(props: ClassDiagramProps) {
	const merged = mergeProps({ columns: 3 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "classes", "links", "columns", "radius", "elevation"]);

	const _boxW = 150;
	const _lineH = 13;

	return (
		<div
			class={[
				"grid gap-4",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{ "grid-template-columns": `repeat(${local.columns}, minmax(0,1fr))` }}
			{...rest}
		>
			<For each={local.classes ?? []}>
				{(c) => (
					<div class="overflow-hidden rounded-md border border-border bg-surface text-left">
						<div class="border-b border-border bg-muted/40 px-2 py-1.5 text-center text-2xs font-bold text-foreground">
							{c.name}
						</div>
						<div class="border-b border-border px-2 py-1">
							<For each={c.attributes ?? []}>
								{(a) => <div class="truncate font-mono text-2xs text-muted-foreground">{a}</div>}
							</For>
							{!(c.attributes ?? []).length && <div class="text-2xs text-muted-foreground/50">—</div>}
						</div>
						<div class="px-2 py-1">
							<For each={c.methods ?? []}>
								{(m) => <div class="truncate font-mono text-2xs text-foreground/80">{m}()</div>}
							</For>
						</div>
					</div>
				)}
			</For>
			{local.children}
		</div>
	);
}
