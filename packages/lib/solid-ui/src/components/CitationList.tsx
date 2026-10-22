/**
 * CitationList - numbered horizontal strip of source citations under an answer.
 */
import { For, type JSX, splitProps } from "solid-js";
import { SourceCard } from "./SourceCard";

export interface Citation {
	/** Source title. */
	title: string;
	/** Link target. */
	href?: string;
	/** Domain or site name. */
	domain?: string;
	/** Short excerpt. */
	snippet?: string;
}

export interface CitationListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Citations in order; numbers start at 1. */
	citations: Citation[];
	/** Row layout instead of grid. @default false */
	vertical?: boolean;
}

export function CitationList(props: CitationListProps) {
	const [local, rest] = splitProps(props, ["class", "citations", "vertical"]);

	const className = () =>
		[
			"solidui-citation-list gap-2",
			local.vertical ? "flex flex-col" : "grid grid-cols-1 sm:grid-cols-2",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: labelled source group, not a form fieldset
		<div class={className()} role="group" aria-label="Sources" {...rest}>
			<For each={local.citations}>
				{(c, i) => <SourceCard index={i() + 1} title={c.title} href={c.href} domain={c.domain} snippet={c.snippet} />}
			</For>
		</div>
	);
}
