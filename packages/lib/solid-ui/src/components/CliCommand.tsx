/**
 * CliCommand — `$ command` line with a copy-to-clipboard button.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CliCommandProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Command text to display and copy */
	command: string;
	/** Prompt symbol @default "$" */
	prompt?: string;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "px-2 py-1 text-2xs", md: "px-3 py-2 text-xs", lg: "px-4 py-2.5 text-sm" } as const;

export function CliCommand(props: CliCommandProps) {
	const [local, rest] = splitProps(props, ["class", "command", "prompt", "size", "radius", "elevation"]);
	const { copy, copied } = useCopyToClipboard(1500);
	return (
		<div
			class={`solidui-cli-command flex items-center gap-2 border border-border bg-surface-elevated font-mono ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="select-none text-muted-foreground">{local.prompt ?? "$"}</span>
			<code class="min-w-0 flex-1 truncate text-foreground">{local.command}</code>
			<button
				type="button"
				aria-label={copied() ? "Copied" : "Copy command"}
				class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onClick={() => void copy(local.command)}
			>
				<Show when={copied()} fallback="⧉">
					<span class="text-success">✓</span>
				</Show>
			</button>
		</div>
	);
}
