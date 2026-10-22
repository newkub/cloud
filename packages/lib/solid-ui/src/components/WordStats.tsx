/**
 * WordStats — live stats bar computing words, characters, sentences and
 * estimated reading time from `text`.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface WordStatsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Text to analyse — stats update live. */
	text: string;
	/** Reading speed used for the estimate, in words per minute. @default 200 */
	wpm?: number;
	/** Show the sentences stat. @default true */
	showSentences?: boolean;
}

export function WordStats(props: WordStatsProps) {
	const [local, rest] = splitProps(props, ["class", "text", "wpm", "showSentences"]);
	const words = () => (local.text ?? "").trim().split(/\s+/).filter(Boolean).length;
	const chars = () => (local.text ?? "").length;
	const sentences = () => (local.text ?? "").split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
	const minutes = () => Math.max(words() > 0 ? 1 : 0, Math.ceil(words() / (local.wpm ?? 200)));

	const stat = (value: () => number | string, label: string) => (
		<span class="inline-flex items-baseline gap-1">
			<span class="font-medium tabular-nums text-foreground">{value()}</span>
			<span>{label}</span>
		</span>
	);

	return (
		<div
			class={`solidui-word-stats flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{stat(words, "words")}
			{stat(chars, "chars")}
			<Show when={local.showSentences ?? true}>{stat(sentences, "sentences")}</Show>
			{stat(() => `${minutes()} min`, "read")}
		</div>
	);
}
