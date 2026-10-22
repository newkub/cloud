/**
 * LineRevealText — reveals each line through an overflow mask with a staggered slide-up.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, onMount, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface LineRevealTextProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Lines to reveal, or pass `text` with newlines instead. */
	lines?: string[];
	/** Multiline text — split on "\n". Ignored when `lines` is set. */
	text?: string;
	/** Stagger step in ms between lines. @default 120 */
	delay?: number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function LineRevealText(props: LineRevealTextProps) {
	const [local, pass] = splitProps(props, ["lines", "text", "delay", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "block",
		variants: textVariants,
		sizes: textSizes,
		defaultVariant: "default",
		defaultSize: "md",
		unstyled: props.unstyled,
	});
	const [shown, setShown] = createSignal(false);
	onMount(() => setShown(true));

	const lines = () => local.lines ?? (local.text ?? "").split("\n").filter((l) => l.length > 0);

	return (
		<div class={className()} role="img" aria-label={lines().join(" ")} {...rest}>
			<For each={lines()}>
				{(line, i) => (
					<span class="solidui-line-reveal-mask block overflow-hidden" aria-hidden="true">
						<span
							class={`block transition-transform duration-500 ease-out motion-reduce:transition-none ${
								shown() ? "translate-y-0" : "translate-y-full"
							}`}
							style={{ "transition-delay": `${i() * (local.delay ?? 120)}ms` }}
						>
							{line}
						</span>
					</span>
				)}
			</For>
		</div>
	);
}
