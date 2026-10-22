/**
 * DeploymentDiagram — UML deployment: nested node boxes (servers) with artifacts.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DeploymentNode {
	name: string;
	/** Stereotype, e.g. «device», «server». */
	kind?: string;
	artifacts?: string[];
	children?: DeploymentNode[];
}

export interface DeploymentDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	nodes?: DeploymentNode[];
	/** Connections as [fromPath, toPath] node-name pairs. */
	links?: [string, string][];
	radius?: Radius;
	elevation?: Elevation;
}

function NodeBox(props: { node: DeploymentNode }) {
	return (
		<div class="rounded-md border border-border bg-surface p-2 shadow-sm">
			<div class="text-2xs text-muted-foreground">{props.node.kind ? `«${props.node.kind}»` : "«node»"}</div>
			<div class="text-xs font-semibold text-foreground">{props.node.name}</div>
			<For each={props.node.artifacts ?? []}>
				{(a) => (
					<div class="mt-1 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-2xs text-foreground/80">
						{a}
					</div>
				)}
			</For>
			{(props.node.children ?? []).length > 0 && (
				<div class="mt-2 grid gap-2 sm:grid-cols-2">
					<For each={props.node.children ?? []}>{(c) => <NodeBox node={c} />}</For>
				</div>
			)}
		</div>
	);
}

export function DeploymentDiagram(props: DeploymentDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "children", "nodes", "links", "radius", "elevation"]);

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<For each={local.nodes ?? []}>{(n) => <NodeBox node={n} />}</For>
			</div>
			{(local.links ?? []).length > 0 && (
				<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
					<For each={local.links ?? []}>
						{([a, b]) => (
							<li class="flex items-center gap-1 font-mono text-2xs text-muted-foreground">
								{a} <span aria-hidden="true">⇢</span> {b}
							</li>
						)}
					</For>
				</ul>
			)}
			{local.children}
		</div>
	);
}
