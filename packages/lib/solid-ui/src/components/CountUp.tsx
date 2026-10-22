/**
 * CountUp — number that animates toward its target when `to` changes / on mount.
 */
import { createEffect, createSignal, type JSX, onCleanup, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface CountUpProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	to: number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Starting value. @default 0 */
	from?: number;
	/** Animation ms. @default 800 */
	duration?: number;
	/** Decimal places. @default 0 */
	decimals?: number;
	/** thousands separator. @default true */
	separator?: boolean;
	prefix?: string;
	suffix?: string;
	/** Easing curve. @default "easeOut" */
	easing?: "linear" | "easeOut" | "easeInOut";
	/** Render final value immediately. */
	static?: boolean;
}

const ease = {
	linear: (t: number) => t,
	easeOut: (t: number) => 1 - (1 - t) ** 3,
	easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
};

export function CountUp(props: CountUpProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"to",
		"from",
		"duration",
		"decimals",
		"separator",
		"prefix",
		"suffix",
		"easing",
		"static",
		"size",
		"variant",
	]);
	const [value, setValue] = createSignal(local.static ? (local.to ?? 0) : (local.from ?? 0));
	let raf: number | undefined;

	createEffect(() => {
		const target = local.to ?? 0;
		if (
			local.static ||
			typeof requestAnimationFrame !== "function" ||
			(typeof window !== "undefined" &&
				typeof window.matchMedia === "function" &&
				window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		) {
			setValue(target);
			return;
		}
		if (raf !== undefined) cancelAnimationFrame(raf);
		const start = value();
		const dur = local.duration ?? 800;
		const fn = ease[local.easing ?? "easeOut"];
		const t0 = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - t0) / dur);
			setValue(start + (target - start) * fn(t));
			if (t < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
	});
	onCleanup(() => {
		if (raf !== undefined) cancelAnimationFrame(raf);
	});

	const fmt = (v: number | undefined) => {
		const fixed = (v ?? 0).toFixed(local.decimals ?? 0);
		const [int, dec] = fixed.split(".");
		const grouped = (local.separator ?? true) ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : int;
		return `${local.prefix ?? ""}${grouped}${dec ? `.${dec}` : ""}${local.suffix ?? ""}`;
	};

	return (
		<span
			class={`solidui-count-up font-mono tabular-nums ${textSizes[local.size ?? "md"]} ${textVariants[local.variant ?? "default"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="sr-only">{fmt(local.to)}</span>
			<span aria-hidden="true">{fmt(value())}</span>
		</span>
	);
}
