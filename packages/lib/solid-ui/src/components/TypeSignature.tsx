/**
 * TypeSignature — TypeScript signature display (docs/reference style).
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface TypeSignatureProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Full signature, e.g. "function pick<T>(list: T[]): T". */
	signature: string;
	/** Name is split out for styling when provided. */
	name?: string;
	/** Return type chip. */
	returns?: string;
	deprecated?: boolean;
	/** "Since" version chip. */
	since?: string;
	description?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-4 py-2.5" } as const;
const codeSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function TypeSignature(props: TypeSignatureProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"signature",
		"name",
		"returns",
		"deprecated",
		"since",
		"description",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-type-signature ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex flex-wrap items-center gap-2">
				<code
					class={`font-mono text-foreground ${codeSize[local.size ?? "md"]} ${local.deprecated ? "line-through opacity-60" : ""}`}
				>
					{local.signature}
				</code>
				<Show when={local.returns}>
					<span class="rounded bg-info/15 px-1.5 py-0.5 font-mono text-2xs text-info">→ {local.returns}</span>
				</Show>
				<Show when={local.deprecated}>
					<span class="rounded bg-destructive/15 px-1.5 py-0.5 text-2xs font-medium text-destructive">deprecated</span>
				</Show>
				<Show when={local.since}>
					<span class="rounded bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground">since {local.since}</span>
				</Show>
			</div>
			<Show when={local.description}>
				<p class={`mt-1 text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>{local.description}</p>
			</Show>
		</div>
	);
}
