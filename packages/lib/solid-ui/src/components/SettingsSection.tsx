/**
 * SettingsSection — settings page section: title/description + label/control rows.
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

export interface SettingsRow {
	label: string;
	/** Helper text under the label. */
	description?: string;
	/** Right-hand control (switch, select, input…). */
	control: JSX.Element;
	/** Visually separate this row with a top border. @default true */
	divided?: boolean;
}

export interface SettingsSectionProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	rows: SettingsRow[];
	/** Footer slot — save buttons, hints. */
	footer?: JSX.Element;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function SettingsSection(props: SettingsSectionProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"rows",
		"footer",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	return (
		<section
			class={`solidui-settings-section overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`${pad[local.size ?? "md"]} border-b border-border`}>
				<h3 class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>{local.title}</h3>
				<Show when={local.description}>
					<p class={`mt-0.5 text-muted-foreground ${textSize[local.size ?? "md"]}`}>{local.description}</p>
				</Show>
			</div>
			<div class={pad[local.size ?? "md"]}>
				<For each={local.rows}>
					{(row, i) => (
						<div
							class={`flex items-center justify-between gap-4 py-2.5 ${(row.divided ?? true) && i() > 0 ? "border-t border-border/50" : ""}`}
						>
							<div class="min-w-0">
								<div class={`font-medium text-foreground ${textSize[local.size ?? "md"]}`}>{row.label}</div>
								<Show when={row.description}>
									<div class="mt-0.5 text-2xs text-muted-foreground">{row.description}</div>
								</Show>
							</div>
							<div class="shrink-0">{row.control}</div>
						</div>
					)}
				</For>
			</div>
			<Show when={local.footer}>
				<div class={`border-t border-border bg-muted/20 ${pad[local.size ?? "md"]}`}>{local.footer}</div>
			</Show>
		</section>
	);
}
