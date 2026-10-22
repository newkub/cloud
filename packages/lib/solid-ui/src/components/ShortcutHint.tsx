/**
 * ShortcutHint — keyboard shortcut rendered as joined kbd chips.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ShortcutHintProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Keys joined by "+" e.g. ["Ctrl","K"] */
	keys: string[];
	/** Optional description after the keys */
	label?: string;
	/** Chip size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const kbdSize = {
	sm: "h-4 min-w-4 px-1 text-2xs",
	md: "h-5 min-w-5 px-1.5 text-2xs",
	lg: "h-6 min-w-6 px-2 text-xs",
} as const;

export function ShortcutHint(props: ShortcutHintProps) {
	const [local, rest] = splitProps(props, ["class", "keys", "label", "size", "radius", "elevation"]);
	return (
		<span class={`solidui-shortcut-hint inline-flex items-center gap-1 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.keys}>
				{(key, i) => (
					<>
						<kbd
							class={`inline-flex items-center justify-center border border-border bg-muted font-mono font-medium ${kbdSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "sm"]} ${elevationMap[local.elevation ?? "sm"]}`}
						>
							{key}
						</kbd>
						{i() < (local.keys ?? []).length - 1 ? <span class="text-2xs text-muted-foreground">+</span> : null}
					</>
				)}
			</For>
			<Show when={local.label}>
				<span class="ml-1 text-xs text-muted-foreground">{local.label}</span>
			</Show>
		</span>
	);
}
