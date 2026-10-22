/**
 * RecordCard — key/value record card with copyable values and optional sections.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface RecordField {
	key: string;
	label: string;
	value: JSX.Element;
	/** Show a copy button for the string form of value. */
	copyable?: boolean;
	/** Render value in monospace. */
	mono?: boolean;
}

export interface RecordCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	fields: RecordField[];
	/** Two-column grid at sm+. @default false (stacked rows) */
	grid?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Extra header slot (badges, actions). */
	actions?: JSX.Element;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function RecordCard(props: RecordCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"fields",
		"grid",
		"size",
		"variant",
		"radius",
		"elevation",
		"actions",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const [copiedKey, setCopiedKey] = createSignal<string | null>(null);
	const copy = async (key: string, value: string) => {
		if (await copyText(value)) setCopiedKey(key);
	};

	return (
		<div
			class={`solidui-record-card ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title || local.actions}>
				<div class="mb-3 flex items-center justify-between gap-2">
					<Show when={local.title}>
						<h3 class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
							{local.title}
						</h3>
					</Show>
					{local.actions}
				</div>
			</Show>
			<dl class={local.grid ? "grid gap-x-6 gap-y-2 sm:grid-cols-2" : "space-y-2"}>
				<For each={local.fields}>
					{(f) => (
						<div class="flex items-baseline justify-between gap-3">
							<dt class={`shrink-0 text-muted-foreground ${textSize[local.size ?? "md"]}`}>{f.label}</dt>
							<dd
								class={`flex min-w-0 items-center gap-1 text-right text-foreground ${textSize[local.size ?? "md"]} ${f.mono ? "font-mono" : ""}`}
							>
								<span class="truncate">{f.value}</span>
								<Show when={f.copyable}>
									<button
										type="button"
										aria-label={`Copy ${f.label}`}
										class="-m-1.5 shrink-0 rounded p-1.5 text-muted-foreground/60 motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										onClick={() => copy(f.key, String(f.value))}
									>
										{copied() && copiedKey() === f.key ? (
											<svg
												class="h-3 w-3 text-success"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												aria-hidden="true"
											>
												<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										) : (
											<svg
												class="h-3 w-3"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												aria-hidden="true"
											>
												<rect x="9" y="9" width="12" height="12" rx="2" />
												<path d="M5 15V5a2 2 0 0 1 2-2h10" />
											</svg>
										)}
									</button>
									<span aria-live="polite" class="sr-only">
										{copied() && copiedKey() === f.key ? "Copied" : ""}
									</span>
								</Show>
							</dd>
						</div>
					)}
				</For>
			</dl>
		</div>
	);
}
