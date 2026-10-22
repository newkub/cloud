/**
 * ScrambleText — decodes text through a scramble/decode animation on mount or value change.
 */
import { createEffect, createSignal, type JSX, onCleanup, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface ScrambleTextProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	text: string;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Milliseconds for the full decode. @default 800 */
	duration?: number;
	/** Charset used for noise. @default alphanumeric */
	chars?: string;
	/** Replay the animation whenever `text` changes. @default true */
	replayOnChange?: boolean;
	/** Disable the animation (SSR/tests). @default false */
	static?: boolean;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function ScrambleText(props: ScrambleTextProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"text",
		"duration",
		"chars",
		"replayOnChange",
		"static",
		"size",
		"variant",
	]);
	const [display, setDisplay] = createSignal(local.text);
	let frame: ReturnType<typeof setInterval> | undefined;

	createEffect(() => {
		const target = local.text;
		if (
			local.static ||
			(typeof window !== "undefined" &&
				typeof window.matchMedia === "function" &&
				window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		) {
			setDisplay(target);
			return;
		}
		clearInterval(frame);
		const chars = local.chars ?? DEFAULT_CHARS;
		const dur = local.duration ?? 800;
		const stepMs = 30;
		const total = Math.max(1, Math.round(dur / stepMs));
		let step = 0;
		frame = setInterval(() => {
			step++;
			const reveal = Math.floor((step / total) * target.length);
			setDisplay(
				target
					.split("")
					.map((c, i) => (i < reveal || c === " " ? c : chars[Math.floor(Math.random() * chars.length)]))
					.join(""),
			);
			if (step >= total) {
				setDisplay(target);
				clearInterval(frame);
			}
		}, stepMs);
	});
	onCleanup(() => clearInterval(frame));

	return (
		<span
			class={`solidui-scramble-text font-mono ${textSizes[local.size ?? "md"]} ${textVariants[local.variant ?? "default"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="sr-only">{local.text}</span>
			<span aria-hidden="true">{display()}</span>
		</span>
	);
}
