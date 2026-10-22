/**
 * WordCount — live word/character counter with optional limit warning.
 */
import { type JSX, splitProps } from "solid-js";

export interface WordCountProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	text: string;
	/** Character limit — shows "used/limit" and warns. */
	limit?: number;
	/** Show characters instead of words. @default false */
	unit?: "words" | "chars" | "both";
	/** Show remaining instead of used. @default false */
	showRemaining?: boolean;
	/** Fraction of limit that triggers warning color. @default 0.9 */
	warnAt?: number;
	size?: "sm" | "md" | "lg";
}

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function WordCount(props: WordCountProps) {
	const [local, rest] = splitProps(props, ["class", "text", "limit", "unit", "showRemaining", "warnAt", "size"]);
	const words = () => (local.text ?? "").trim().split(/\s+/).filter(Boolean).length;
	const chars = () => (local.text ?? "").length;
	const used = () => (local.unit === "words" ? words() : chars());
	const over = () => local.limit !== undefined && used() > local.limit;
	const warn = () => !over() && local.limit !== undefined && used() >= local.limit * (local.warnAt ?? 0.9);
	const shown = () => (local.showRemaining && local.limit !== undefined ? Math.max(0, local.limit - used()) : used());
	const text = () => {
		if (local.unit === "both") return `${words()} words · ${chars()} chars`;
		return local.limit !== undefined
			? `${shown()}${local.showRemaining ? " left" : `/${local.limit}`}`
			: `${shown()} ${local.unit === "chars" ? "chars" : "words"}`;
	};
	return (
		<span
			class={`solidui-word-count tabular-nums ${textSize[local.size ?? "md"]} ${over() ? "font-medium text-destructive" : warn() ? "text-warning" : "text-muted-foreground"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{text()}
		</span>
	);
}
