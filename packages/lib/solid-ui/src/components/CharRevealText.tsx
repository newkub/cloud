/**
 * CharRevealText — reveals text with a per-character/word staggered CSS transition.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, onMount, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface CharRevealTextProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Text to reveal. */
	text: string;
	/** Reveal granularity. @default "char" */
	by?: "char" | "word";
	/** Stagger step in ms between units. @default 30 */
	delay?: number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CharRevealText(props: CharRevealTextProps) {
	const [local, pass] = splitProps(props, ["text", "by", "delay", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "inline-block",
		variants: textVariants,
		sizes: textSizes,
		defaultVariant: "default",
		defaultSize: "md",
		unstyled: props.unstyled,
	});
	const [shown, setShown] = createSignal(false);
	onMount(() => setShown(true));

	const units = () => {
		const text = local.text ?? "";
		if ((local.by ?? "char") === "word") return text.split(/(\s+)/).filter((u) => u.length > 0);
		return text.split("");
	};
	/** Stagger index — counts only non-whitespace units. */
	const stagger = (i: number) =>
		units()
			.slice(0, i)
			.filter((u) => u.trim().length > 0).length;

	return (
		<span class={className()} role="img" aria-label={local.text} {...rest}>
			<For each={units()}>
				{(unit, i) =>
					unit.trim().length === 0 ? (
						unit
					) : (
						<span
							aria-hidden="true"
							class={`solidui-char-reveal-unit inline-block whitespace-pre transition-all duration-300 ease-out motion-reduce:transition-none ${
								shown() ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
							}`}
							style={{ "transition-delay": `${stagger(i()) * (local.delay ?? 30)}ms` }}
						>
							{unit}
						</span>
					)
				}
			</For>
		</span>
	);
}
