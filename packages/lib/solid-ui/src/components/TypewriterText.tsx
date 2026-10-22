/**
 * TypewriterText — types text character-by-character; optionally loops through phrases.
 */
import { createEffect, createSignal, type JSX, onCleanup, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface TypewriterTextProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Single string or phrases to cycle. */
	text: string | string[];
	/** ms per character. @default 60 */
	speed?: number;
	/** ms deleting per character. @default 30 */
	deleteSpeed?: number;
	/** Pause at the end of a phrase (ms). @default 1500 */
	pause?: number;
	/** Cycle phrases forever. @default false */
	loop?: boolean;
	/** Blinking block cursor. @default true */
	cursor?: boolean;
	/** Cursor glyph. @default "▍" */
	cursorChar?: string;
	/** Render final text instantly (SSR/tests). */
	static?: boolean;
}

export function TypewriterText(props: TypewriterTextProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"text",
		"speed",
		"deleteSpeed",
		"pause",
		"loop",
		"cursor",
		"cursorChar",
		"static",
		"size",
		"variant",
	]);
	const phrases = () => (Array.isArray(local.text) ? local.text : [local.text]);
	const [display, setDisplay] = createSignal(local.static ? phrases()[0] : "");
	let timer: ReturnType<typeof setTimeout> | undefined;

	createEffect(() => {
		const list = phrases();
		if (
			local.static ||
			(typeof window !== "undefined" &&
				typeof window.matchMedia === "function" &&
				window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		) {
			setDisplay(list[0]);
			return;
		}
		clearTimeout(timer);
		let phrase = 0;
		let idx = 0;
		let deleting = false;
		const tick = () => {
			const target = list[phrase];
			if (!deleting) {
				idx++;
				setDisplay(target.slice(0, idx));
				if (idx >= target.length) {
					if (list.length > 1 || local.loop) {
						deleting = true;
						timer = setTimeout(tick, local.pause ?? 1500);
					}
					return;
				}
				timer = setTimeout(tick, local.speed ?? 60);
			} else {
				idx--;
				setDisplay(target.slice(0, idx));
				if (idx <= 0) {
					deleting = false;
					phrase = (phrase + 1) % list.length;
					if (!local.loop && phrase === 0 && list.length <= 1) return;
				}
				timer = setTimeout(tick, local.deleteSpeed ?? 30);
			}
		};
		timer = setTimeout(tick, 200);
	});
	onCleanup(() => clearTimeout(timer));

	return (
		<span
			class={`solidui-typewriter-text ${textSizes[local.size ?? "md"]} ${textVariants[local.variant ?? "default"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="sr-only">{phrases().join(", ")}</span>
			<span aria-hidden="true">
				{display()}
				{(local.cursor ?? true) && <span class="motion-safe:animate-pulse">{local.cursorChar ?? "▍"}</span>}
			</span>
		</span>
	);
}
