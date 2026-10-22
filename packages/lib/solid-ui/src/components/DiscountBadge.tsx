/**
 * DiscountBadge — percent-off marker: inline pill or absolute corner ribbon (parent needs `relative overflow-hidden`).
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface DiscountBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Discount percentage, e.g. 25 → "-25%" / "25% OFF". */
	pct: number;
	/** `pill` renders inline; `ribbon` renders an absolute rotated strip in the top-right corner of the nearest positioned ancestor. @default "pill" */
	variant?: "ribbon" | "pill";
	/** Label override — replaces the generated text. */
	label?: string;
	/** Ribbon corner. @default "right" */
	corner?: "left" | "right";
	/** Pill size. @default "md" */
	size?: "sm" | "md";
}

const pillSize = {
	sm: "px-1.5 py-0.5 text-2xs",
	md: "px-2 py-0.5 text-xs",
} as const;

export function DiscountBadge(props: DiscountBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "pct", "variant", "label", "corner", "size"]);
	const a11y = `Save ${local.pct}%`;

	return (
		<Show
			when={(local.variant ?? "pill") === "pill"}
			fallback={
				<span
					role="img"
					aria-label={a11y}
					class={`solidui-discount-badge absolute top-3 z-[1] bg-destructive px-8 py-0.5 text-center text-2xs font-bold uppercase tracking-wide text-destructive-foreground shadow-sm ${
						(local.corner ?? "right") === "right" ? "-right-8 rotate-45" : "-left-8 -rotate-45"
					} ${local.class ?? ""}`.trim()}
					{...rest}
				>
					{local.label ?? `${local.pct}% off`}
				</span>
			}
		>
			<span
				role="img"
				aria-label={a11y}
				class={`solidui-discount-badge inline-flex items-center rounded-full bg-destructive font-semibold text-destructive-foreground ${pillSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				{local.label ?? `-${local.pct}%`}
			</span>
		</Show>
	);
}
