/**
 * DatasetCard — dataset summary card with row/col/size stats and a truncated schema preview.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface DatasetField {
	/** Column name. */
	name: string;
	/** Column type, e.g. "string" or "int64". */
	type: string;
}

export interface DatasetCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Dataset name. */
	name: string;
	/** Row count. */
	rows: number;
	/** Column count. */
	cols: number;
	/** Schema fields — the first `maxFields` are previewed. */
	schema?: DatasetField[];
	/** On-disk size label, e.g. "1.2 GB". */
	size?: string | number;
	/** Fields shown in the schema preview @default 5 */
	maxFields?: number;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const fmt = (n: string | number) => (typeof n === "number" ? n.toLocaleString("en-US") : n);

export function DatasetCard(props: DatasetCardProps) {
	// `size` here is a data label ("1.2 GB"), not the density axis — split it and
	// the other data props off before handing the rest to useComponentClasses.
	const [local, helperProps] = splitProps(props, ["name", "rows", "cols", "schema", "size", "maxFields", "children"]);
	const { className, rest: dom } = useComponentClasses(helperProps, {
		base: "solidui-dataset-card border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const dataSize = () => local.size;
	const visible = () => (local.schema ?? []).slice(0, local.maxFields ?? 5);
	const hidden = () => Math.max(0, (local.schema ?? []).length - visible().length);
	return (
		<div class={className()} {...dom}>
			<h3 class="truncate text-sm font-semibold text-foreground">{local.name}</h3>
			<div class="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
				<span>
					<span class="font-semibold tabular-nums text-foreground">{fmt(local.rows)}</span> rows
				</span>
				<span>
					<span class="font-semibold tabular-nums text-foreground">{fmt(local.cols)}</span> cols
				</span>
				<Show when={dataSize() !== undefined}>
					<span>
						<span class="font-semibold tabular-nums text-foreground">{fmt(dataSize() ?? "")}</span>
					</span>
				</Show>
			</div>
			<Show when={(local.schema ?? []).length > 0}>
				<div class="mt-3 overflow-hidden rounded-md border border-border">
					<table class="w-full text-xs">
						<thead>
							<tr class="border-b border-border bg-muted/50 text-left text-muted-foreground">
								<th class="px-2.5 py-1.5 font-medium" scope="col">
									Field
								</th>
								<th class="px-2.5 py-1.5 font-medium" scope="col">
									Type
								</th>
							</tr>
						</thead>
						<tbody>
							<For each={visible()}>
								{(f) => (
									<tr class="border-b border-border/50 last:border-0">
										<td class="px-2.5 py-1.5 font-mono text-foreground">{f.name}</td>
										<td class="px-2.5 py-1.5 font-mono text-muted-foreground">{f.type}</td>
									</tr>
								)}
							</For>
							<Show when={hidden() > 0}>
								<tr>
									<td colspan={2} class="px-2.5 py-1.5 text-muted-foreground">
										+{hidden()} more {hidden() === 1 ? "field" : "fields"}
									</td>
								</tr>
							</Show>
						</tbody>
					</table>
				</div>
			</Show>
			{local.children}
		</div>
	);
}
