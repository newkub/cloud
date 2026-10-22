/**
 * KeyboardLegend - grid of keyboard shortcuts with kbd chips and descriptions.
 */

import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { Kbd } from "./Kbd";

export interface KeyboardShortcut {
	/** Keys pressed together, in order — e.g. ["Ctrl", "K"]. */
	keys: string[];
	/** What the shortcut does. */
	label: string;
}

export interface KeyboardLegendProps extends JSX.HTMLAttributes<HTMLDivElement> {
	shortcuts: KeyboardShortcut[];
	/** Optional heading rendered above the grid. */
	title?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function KeyboardLegend(props: KeyboardLegendProps) {
	const [local, rest] = splitProps(props, ["class", "shortcuts", "title", "variant", "radius", "unstyled"]);

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-keyboard-legend border p-4",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "lg"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<Show when={local.title}>
				<h3 class="mb-3 text-sm font-semibold text-foreground">{local.title}</h3>
			</Show>
			<dl class="grid gap-x-8 gap-y-2 sm:grid-cols-2">
				<For each={local.shortcuts}>
					{(s) => (
						<div class="flex items-center justify-between gap-3">
							<dt class="flex shrink-0 items-center gap-1">
								<For each={s.keys}>
									{(key, i) => (
										<>
											<Show when={i() > 0}>
												<span class="text-2xs text-muted-foreground" aria-hidden="true">
													+
												</span>
											</Show>
											<Kbd>{key}</Kbd>
										</>
									)}
								</For>
							</dt>
							<dd class="text-sm text-muted-foreground">{s.label}</dd>
						</div>
					)}
				</For>
			</dl>
		</div>
	);
}
