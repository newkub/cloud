/**
 * LoadingBar — slim top progress bar (nprogress style) for navigation/fetch.
 */
import { type JSX, splitProps } from "solid-js";
import { type BarVariant, barVariants } from "../lib/variants";

export interface LoadingBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** 0–100 — omitted means indeterminate. */
	progress?: number;
	/** Bar tone — used when `color` is not set. @default "default" (primary) */
	variant?: BarVariant;
	/** Stick to the top of the viewport. @default true */
	fixed?: boolean;
	/** Bar height px. @default 2 */
	height?: number;
	/** Bar color class. @default primary */
	color?: string;
	/** Glow shadow at the bar tip. @default true */
	glow?: boolean;
}

export function LoadingBar(props: LoadingBarProps) {
	const [local, rest] = splitProps(props, ["class", "progress", "fixed", "height", "color", "glow", "variant"]);
	const indeterminate = () => local.progress === undefined;
	return (
		<div
			role="progressbar"
			aria-label="Loading"
			aria-valuenow={indeterminate() ? undefined : local.progress}
			aria-valuemin={0}
			aria-valuemax={100}
			class={`solidui-loading-bar inset-x-0 top-0 z-50 ${(local.fixed ?? true) ? "fixed" : "absolute"} ${local.class ?? ""}`.trim()}
			style={{ height: `${local.height ?? 2}px` }}
			{...rest}
		>
			<div
				class={`h-full ${local.color ?? barVariants[local.variant ?? "default"]} ${indeterminate() ? "w-1/3 motion-safe:animate-pulse" : "transition-[width] duration-300 ease-out motion-reduce:transition-none"} ${(local.glow ?? true) ? "shadow-[0_0_8px_currentColor]" : ""}`}
				style={{ width: indeterminate() ? undefined : `${Math.min(100, Math.max(0, local.progress ?? 0))}%` }}
			/>
		</div>
	);
}
