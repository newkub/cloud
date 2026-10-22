/**
 * FaqSection — question/answer list rendered as an accordion.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Accordion, AccordionItem } from "./Accordion";

export interface FaqItem {
	/** Question text */
	question: string;
	/** Answer content */
	answer: JSX.Element;
	/** Start expanded @default false */
	defaultOpen?: boolean;
}

export interface FaqSectionProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Section heading @default "Frequently asked questions" */
	title?: string;
	/** Supporting line under the heading */
	subtitle?: string;
	/** Q&A items */
	items: FaqItem[];
	/** Narrow, centered column @default true */
	centered?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function FaqSection(props: FaqSectionProps) {
	const [local, rest] = splitProps(props, ["class", "title", "subtitle", "items", "centered", "radius", "elevation"]);
	return (
		<section
			class={`solidui-faq-section ${local.centered === false ? "" : "mx-auto max-w-2xl"} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<h2 class="text-xl font-semibold text-foreground">{local.title ?? "Frequently asked questions"}</h2>
			{local.subtitle && <p class="mt-1 text-sm text-muted-foreground">{local.subtitle}</p>}
			<Accordion class="mt-4" variant="ghost" size="none">
				<For each={local.items}>
					{(item) => (
						<AccordionItem title={item.question} defaultOpen={item.defaultOpen}>
							{item.answer}
						</AccordionItem>
					)}
				</For>
			</Accordion>
		</section>
	);
}
