/**
 * ModelCard — ML model summary card with version/framework chips, metric grid and update stamp.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ModelMetric {
	/** Metric name shown as a muted label. */
	label: string;
	/** Metric value — rendered with tabular numerals. */
	value: string | number;
}

export interface ModelCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Model name. */
	name: string;
	/** Model version — a "v" prefix is added when missing. */
	version?: string;
	/** Framework label, e.g. "PyTorch". */
	framework?: string;
	/** Metric chips shown in the body grid. */
	metrics?: ModelMetric[];
	/** Last-updated stamp — Date values render as YYYY-MM-DD. */
	updatedAt?: string | number | Date;
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ModelCard(props: ModelCardProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-model-card border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: paddingSizes,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["name", "version", "framework", "metrics", "updatedAt", "children"]);
	const versionText = () => {
		const v = local.version;
		return v ? (v.startsWith("v") ? v : `v${v}`) : undefined;
	};
	const updatedText = () => {
		const v = local.updatedAt;
		return v instanceof Date ? v.toISOString().slice(0, 10) : v;
	};
	return (
		<div class={className()} {...dom}>
			<div class="flex items-start justify-between gap-2">
				<h3 class="min-w-0 truncate text-sm font-semibold text-foreground">{local.name}</h3>
				<div class="flex shrink-0 items-center gap-1">
					<Show when={versionText()}>
						<span
							class={`inline-flex items-center rounded border px-1.5 py-0.5 font-medium text-2xs ${chipVariants.default}`}
						>
							{versionText()}
						</span>
					</Show>
					<Show when={local.framework}>
						<span
							class={`inline-flex items-center rounded border px-1.5 py-0.5 font-medium text-2xs ${chipVariants.primary}`}
						>
							{local.framework}
						</span>
					</Show>
				</div>
			</div>
			<Show when={(local.metrics ?? []).length > 0}>
				<dl class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
					<For each={local.metrics}>
						{(m) => (
							<div class="rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
								<dt class="font-medium text-2xs uppercase tracking-wide text-muted-foreground">{m.label}</dt>
								<dd class="mt-0.5 font-semibold text-sm tabular-nums text-foreground">{m.value}</dd>
							</div>
						)}
					</For>
				</dl>
			</Show>
			{local.children}
			<Show when={updatedText() !== undefined}>
				<p class="mt-3 border-t border-border pt-2 text-2xs text-muted-foreground">Updated {updatedText()}</p>
			</Show>
		</div>
	);
}
