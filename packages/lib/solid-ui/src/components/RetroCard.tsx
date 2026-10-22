/**
 * RetroCard - three-column retrospective card (went well / didn't go well / actions) with tone headers.
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

export interface RetroCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card heading. */
	title?: string;
	/** Positive observations. */
	wentWell?: string[];
	/** Negative observations. */
	didntGoWell?: string[];
	/** Follow-up action items. */
	actions?: string[];
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const columnTone = {
	wentWell: "border-success/30 bg-success/10 text-success",
	didntGoWell: "border-destructive/30 bg-destructive/10 text-destructive",
	actions: "border-info/30 bg-info/10 text-info",
} as const;

export function RetroCard(props: RetroCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-retro-card flex flex-col gap-4 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["title", "wentWell", "didntGoWell", "actions"]);

	const columns = () => [
		{ key: "wentWell" as const, label: "Went well", items: local.wentWell ?? [] },
		{ key: "didntGoWell" as const, label: "Didn't go well", items: local.didntGoWell ?? [] },
		{ key: "actions" as const, label: "Actions", items: local.actions ?? [] },
	];

	return (
		<div class={className()} {...rest}>
			<Show when={local.title}>
				<div class="font-semibold text-foreground">{local.title}</div>
			</Show>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<For each={columns()}>
					{(column) => (
						<section aria-label={column.label} class="flex flex-col gap-2">
							<span
								class={`inline-flex w-fit items-center rounded border px-2 py-0.5 text-2xs font-semibold ${columnTone[column.key]}`}
							>
								{column.label}
							</span>
							<ul class="flex flex-col gap-1.5">
								<For each={column.items} fallback={<li class="text-xs text-muted-foreground">None</li>}>
									{(item) => (
										<li class="rounded-md border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground">
											{item}
										</li>
									)}
								</For>
							</ul>
						</section>
					)}
				</For>
			</div>
		</div>
	);
}
