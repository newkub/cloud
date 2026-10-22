/**
 * FlipNumber — split-flap style digit display that animates on value change.
 */
import { createEffect, createSignal, For, type JSX, onCleanup, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface FlipNumberProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value: number | string;
	/** Pad to fixed length (e.g. 4 → "0042"). */
	pad?: number;
	/** Per-digit roll duration (ms). @default 300 */
	duration?: number;
	size?: "sm" | "md" | "lg";
	/** Card background for each digit. */
	variant?: "bare" | "card";
	/** Corner radius on digit cards. */
	radius?: Radius;
}

const digitCls = {
	sm: "h-6 w-4 text-sm",
	md: "h-9 w-6 text-xl",
	lg: "h-12 w-8 text-2xl",
} as const;

export function FlipNumber(props: FlipNumberProps) {
	const [local, rest] = splitProps(props, ["class", "value", "pad", "duration", "size", "variant", "radius"]);
	const str = () => {
		const s = String(local.value);
		return local.pad ? s.padStart(local.pad, "0") : s;
	};
	return (
		<div class={`solidui-flip-number inline-flex gap-0.5 ${local.class ?? ""}`.trim()} {...rest}>
			<span class="sr-only">{str()}</span>
			<For each={str().split("")}>
				{(d, i) => (
					<FlipDigit
						digit={d}
						class={`flex items-center justify-center font-mono font-semibold tabular-nums text-foreground ${digitCls[local.size ?? "md"]} ${
							local.variant === "card"
								? `border border-border bg-surface shadow-sm ${radiusMap[local.radius ?? "md"]}`
								: ""
						}`}
						duration={local.duration ?? 300}
						delay={i() * 40}
					/>
				)}
			</For>
		</div>
	);
}

function FlipDigit(props: { digit: string; class: string; duration: number; delay: number }) {
	const [shown, setShown] = createSignal(props.digit);
	const [flipping, setFlipping] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	createEffect(() => {
		const next = props.digit;
		if (next === shown()) return;
		clearTimeout(timer);
		setFlipping(true);
		timer = setTimeout(
			() => {
				setShown(next);
				setFlipping(false);
			},
			props.delay + props.duration / 2,
		);
	});
	onCleanup(() => clearTimeout(timer));
	return (
		<span
			aria-hidden="true"
			class={`${props.class} overflow-hidden transition-transform motion-reduce:transition-none ${flipping() ? "-scale-y-50 opacity-60" : ""}`}
		>
			{shown()}
		</span>
	);
}
