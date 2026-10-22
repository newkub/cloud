/**
 * KudosCard - peer recognition card with recipient avatar initials, message and tag.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface KudosCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Recipient name — initials are derived for the avatar. */
	to: string;
	/** Sender name. */
	from?: string;
	/** Recognition message. */
	message: string;
	/** Optional category tag chip. */
	tag?: string;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const initials = (name?: string) =>
	(name ?? "")
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("") || "?";

export function KudosCard(props: KudosCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-kudos-card flex flex-col gap-3 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["to", "from", "message", "tag"]);

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center gap-3">
				<span
					aria-hidden="true"
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
				>
					{initials(local.to)}
				</span>
				<div class="min-w-0 flex-1">
					<div class="truncate text-sm font-semibold text-foreground">{local.to}</div>
					<div class="text-2xs uppercase tracking-wide text-muted-foreground">Kudos</div>
				</div>
				<Show when={local.tag}>
					<span class="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary">
						{local.tag}
					</span>
				</Show>
			</div>
			<p class="text-sm text-foreground">{local.message}</p>
			<Show when={local.from}>
				<div class="text-xs text-muted-foreground">— {local.from}</div>
			</Show>
		</div>
	);
}
