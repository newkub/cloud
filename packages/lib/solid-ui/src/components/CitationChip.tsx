/**
 * CitationChip - inline source chip that reveals a small title/url card on hover or focus.
 */
import { createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";
import { chipVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<"sm" | "md", string> = {
	sm: "px-1.5 py-0.5 text-2xs",
	md: "px-2 py-0.5 text-xs",
};

export interface CitationChipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Citation index — rendered as `[n]`. Ignored when `label` is set. @default 1 */
	index?: number;
	/** Custom chip text, e.g. "[docs]". */
	label?: string;
	/** Source title shown in the hover card. */
	title?: string;
	/** Source URL; makes the chip a link and is shown in the hover card. */
	url?: string;
	size?: "sm" | "md";
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CitationChip(props: CitationChipProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"index",
		"label",
		"title",
		"url",
		"size",
		"radius",
		"unstyled",
		"children",
	]);

	const [open, setOpen] = createSignal(false);
	const tipId = createUniqueId();
	const text = () => local.label ?? `[${local.index ?? 1}]`;
	const hasCard = () => local.title !== undefined || local.url !== undefined;

	const triggerClass = () =>
		local.unstyled
			? ""
			: [
					"inline-flex items-center gap-1 border font-medium transition-colors",
					"hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					chipVariants.primary,
					sizeMap[local.size ?? "md"],
					radiusMap[local.radius ?? "md"],
				].join(" ");

	const handlers = {
		onMouseEnter: () => setOpen(true),
		onMouseLeave: () => setOpen(false),
		onFocus: () => setOpen(true),
		onBlur: () => setOpen(false),
		onKeyDown: (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		},
	};

	return (
		<span
			class={["solidui-citation-chip relative inline-flex align-baseline", local.unstyled ? "" : (local.class ?? "")]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<Show
				when={local.url}
				fallback={
					<button type="button" class={triggerClass()} aria-describedby={open() ? tipId : undefined} {...handlers}>
						{local.children ?? text()}
					</button>
				}
			>
				<a
					href={local.url}
					target="_blank"
					rel="noreferrer"
					class={triggerClass()}
					aria-describedby={open() ? tipId : undefined}
					{...handlers}
				>
					{local.children ?? text()}
				</a>
			</Show>
			<Show when={open() && hasCard()}>
				<span
					role="tooltip"
					id={tipId}
					class="absolute left-0 top-full z-10 mt-1 block w-56 rounded-md border border-border bg-surface p-2 text-left text-xs shadow-lg"
				>
					<Show when={local.title}>
						<span class="block font-medium text-foreground">{local.title}</span>
					</Show>
					<Show when={local.url}>
						<span class="block truncate text-primary">{local.url}</span>
					</Show>
				</span>
			</Show>
		</span>
	);
}
