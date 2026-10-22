/**
 * WordsFlip — cycles through a list of words with a vertical flip transition.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface WordsFlipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Words to cycle through. */
	words: string[];
	/** ms each word stays visible. @default 2500 */
	intervalMs?: number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const FLIP_MS = 220;

export function WordsFlip(props: WordsFlipProps) {
	const [local, pass] = splitProps(props, ["words", "intervalMs", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "inline-block",
		variants: textVariants,
		sizes: textSizes,
		defaultVariant: "default",
		defaultSize: "md",
		unstyled: props.unstyled,
	});
	const [index, setIndex] = createSignal(0);
	const [flipped, setFlipped] = createSignal(false);
	const list = () => local.words ?? [];
	const current = () => (list().length ? list()[index() % list().length] : "");

	let interval: ReturnType<typeof setInterval> | undefined;
	let flipTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		const reduce =
			typeof window !== "undefined" &&
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		interval = setInterval(() => {
			if (list().length < 2) return;
			if (reduce) {
				setIndex((i) => (i + 1) % list().length);
				return;
			}
			setFlipped(true);
			flipTimer = setTimeout(() => {
				setIndex((i) => (i + 1) % list().length);
				setFlipped(false);
			}, FLIP_MS);
		}, local.intervalMs ?? 2500);
	});
	onCleanup(() => {
		clearInterval(interval);
		clearTimeout(flipTimer);
	});

	return (
		<span class={className()} {...rest}>
			<span class="sr-only">{list().join(", ")}</span>
			<span
				aria-hidden="true"
				class={`inline-block transition-all duration-200 ease-out motion-reduce:transition-none ${
					flipped() ? "translate-y-1 opacity-0 [transform:rotateX(90deg)]" : "translate-y-0 opacity-100"
				}`}
			>
				{current()}
			</span>
		</span>
	);
}
