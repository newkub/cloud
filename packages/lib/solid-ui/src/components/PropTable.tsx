/**
 * PropTable — documents a component's props: name, type, default, description.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PropRow {
	/** Prop name */
	name: string;
	/** Type signature, e.g. `"sm" | "md" | "lg"` */
	type: string;
	/** Whether the prop is required @default false */
	required?: boolean;
	/** Default value rendered inline with the name */
	default?: string;
	/** Human description */
	description?: string;
}

export interface PropTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Rows describing each prop */
	items: PropRow[];
	/** Heading above the table — pass an empty string to hide @default "Props" */
	title?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function PropTable(props: PropTableProps) {
	const [local, rest] = splitProps(props, ["class", "items", "title", "radius", "elevation"]);
	return (
		<div
			class={`solidui-prop-table ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title !== ""}>
				<h3 class="mb-2 text-sm font-semibold text-foreground">{local.title ?? "Props"}</h3>
			</Show>
			<div class="overflow-x-auto rounded-lg border border-border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
							<th scope="col" class="px-3 py-2 font-medium">
								Name
							</th>
							<th scope="col" class="px-3 py-2 font-medium">
								Type
							</th>
							<th scope="col" class="px-3 py-2 font-medium">
								Default
							</th>
							<th scope="col" class="px-3 py-2 font-medium">
								Description
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={local.items}>
							{(p) => (
								<tr class="border-b border-border last:border-0">
									<td class="px-3 py-2">
										<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{p.name}</code>
										<Show when={p.required}>
											<span class="ml-1.5 text-2xs font-medium text-destructive">required</span>
										</Show>
									</td>
									<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
									<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
									<td class="px-3 py-2 text-xs text-muted-foreground">{p.description ?? ""}</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</div>
		</div>
	);
}
