/**
 * StockBadge — availability pill with status dot: in-stock, low-stock (n left) or out-of-stock.
 */
import { type JSX, Show, splitProps } from "solid-js";

export type StockLevel = "in" | "low" | "out";

export interface StockBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Availability level. */
	level: StockLevel;
	/** Units remaining — shown on the "low" label ("Only {count} left"). */
	count?: number;
	/** Label override — replaces the default text for the level. */
	label?: string;
	/** Badge size. @default "md" */
	size?: "sm" | "md";
}

const levelCls: Record<StockLevel, string> = {
	in: "border-success/30 bg-success/10 text-success",
	low: "border-warning/30 bg-warning/10 text-warning",
	out: "border-border bg-muted text-muted-foreground",
};

const dotCls: Record<StockLevel, string> = {
	in: "bg-success",
	low: "bg-warning",
	out: "bg-muted-foreground",
};

const sizeCls = {
	sm: "px-1.5 py-0.5 text-2xs",
	md: "px-2 py-0.5 text-xs",
} as const;

export function StockBadge(props: StockBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "level", "count", "label", "size"]);
	const text = () => {
		if (local.label) return local.label;
		if (local.level === "in") return "In stock";
		if (local.level === "out") return "Out of stock";
		return local.count !== undefined ? `Only ${local.count} left` : "Low stock";
	};
	return (
		<span
			role="status"
			class={`solidui-stock-badge inline-flex items-center gap-1.5 rounded-full border font-medium ${levelCls[local.level]} ${sizeCls[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span aria-hidden="true" class={`h-1.5 w-1.5 rounded-full ${dotCls[local.level]}`} />
			{text()}
			<Show when={local.level === "in" && local.count !== undefined}>
				<span class="text-success/70">· {local.count}</span>
			</Show>
		</span>
	);
}
