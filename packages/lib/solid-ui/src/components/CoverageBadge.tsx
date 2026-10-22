/**
 * CoverageBadge — code coverage % pill with threshold colors.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface CoverageBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	percent: number;
	/** Label before the % — e.g. "coverage". */
	label?: string;
	/** Color thresholds — [warnBelow, dangerBelow]. @default [80, 50] */
	thresholds?: [number, number];
	/** Copy "coverage: N%" on click. */
	copyable?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Minimal — % only. */
	compact?: boolean;
}

const sizeCls = { sm: "text-2xs px-1.5 py-0", md: "text-xs px-2 py-0.5", lg: "text-sm px-2.5 py-1" } as const;

export function CoverageBadge(props: CoverageBadgeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"percent",
		"label",
		"thresholds",
		"copyable",
		"size",
		"radius",
		"compact",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1200);
	const color = () => {
		const [warn, danger] = local.thresholds ?? [80, 50];
		return local.percent >= warn
			? "bg-success/15 text-success"
			: local.percent >= danger
				? "bg-warning/15 text-warning"
				: "bg-destructive/15 text-destructive";
	};
	const copy = () => {
		if (!local.copyable) return;
		void copyText(`${local.label ?? "coverage"}: ${local.percent}%`);
	};
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: role/tabindex applied only when copyable
		<span
			class={`solidui-coverage-badge inline-flex items-center gap-1 font-mono font-semibold ${sizeCls[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${color()} ${local.copyable ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : ""} ${local.class ?? ""}`.trim()}
			role={local.copyable ? "button" : undefined}
			tabIndex={local.copyable ? 0 : undefined}
			onClick={copy}
			onKeyDown={(e) => {
				if (local.copyable && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					copy();
				}
			}}
			{...rest}
		>
			<Show when={!local.compact && local.label}>
				<span class="font-normal opacity-80">{local.label}</span>
			</Show>
			{copied() ? "copied" : `${local.percent}%`}
		</span>
	);
}
