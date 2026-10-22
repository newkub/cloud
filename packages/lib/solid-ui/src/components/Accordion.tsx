/**
 * Accordion - collapsible content sections with single or multiple expansion.
 */
import { children, createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface AccordionItemProps {
	title: JSX.Element;
	children: JSX.Element;
	defaultOpen?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AccordionItem(props: AccordionItemProps) {
	const [open, setOpen] = createSignal(props.defaultOpen ?? false);
	const content = children(() => props.children);
	const id = `accordion-item-${createUniqueId()}`;
	const triggerId = `${id}-trigger`;
	const contentId = `${id}-content`;

	return (
		<div class="border-b border-border last:border-b-0">
			<button
				type="button"
				id={triggerId}
				class="flex w-full items-center justify-between rounded-sm py-3 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open()}
				aria-controls={open() ? contentId : undefined}
			>
				<span class="text-foreground">{props.title}</span>
				<svg
					class={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""} ${props.radius ? radiusMap[props.radius] : ""} ${props.elevation ? elevationMap[props.elevation] : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			<Show when={open()}>
				<section id={contentId} class="pb-3 text-sm text-muted-foreground" aria-labelledby={triggerId}>
					{content()}
				</section>
			</Show>
		</div>
	);
}

export interface AccordionProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Accordion(props: AccordionProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"w-full ",
			surfaceVariants[local.variant ?? "default"],
			local.size ? paddingSizes[local.size] : "",
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={className()} {...rest}>
			<div class={local.size ? "" : "px-4"}>{local.children}</div>
		</div>
	);
}
