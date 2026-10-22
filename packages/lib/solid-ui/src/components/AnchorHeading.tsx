/**
 * AnchorHeading — heading with a hoverable "#" permalink anchor.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { type TextVariant, textVariants } from "../lib/variants";

export interface AnchorHeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
	/** Heading level 1–6. @default 2 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** Anchor id — defaults to a slug of the text content. */
	anchor?: string;
	/** Show the # link icon on hover. @default true */
	link?: boolean;
	/** Copy the anchor URL when clicking the icon instead of navigating. */
	copyOnClick?: boolean;
}

const sizeMap = {
	1: "text-3xl font-bold tracking-tight",
	2: "text-2xl font-semibold tracking-tight",
	3: "text-xl font-semibold",
	4: "text-lg font-semibold",
	5: "text-base font-semibold",
	6: "text-sm font-semibold",
} as const;
const tags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-");
}

export function AnchorHeading(props: AnchorHeadingProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"level",
		"anchor",
		"link",
		"copyOnClick",
		"id",
		"variant",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const id = () => local.anchor ?? local.id ?? slugify(textOf(local.children));

	const activate = (e: MouseEvent) => {
		if (!local.copyOnClick) return; // default anchor navigation
		e.preventDefault();
		const url = `${window.location.origin}${window.location.pathname}#${id()}`;
		void copyText(url);
	};

	return (
		<Dynamic
			component={tags[(local.level ?? 2) - 1]}
			id={id()}
			class={`solidui-anchor-heading group relative ${textVariants[local.variant ?? "default"]} ${sizeMap[local.level ?? 2]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
			<Show when={local.link ?? true}>
				<a
					href={`#${id()}`}
					class="ml-2 inline-block rounded align-middle text-muted-foreground/0 motion-safe:transition-colors group-hover:text-muted-foreground hover:!text-primary focus-visible:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-label="Link to this section"
					onClick={activate}
				>
					{copied() ? (
						<svg
							class="h-4 w-4 text-success"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					) : (
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					)}
				</a>
			</Show>
		</Dynamic>
	);
}

function textOf(children: JSX.Element): string {
	if (typeof children === "string") return children;
	if (Array.isArray(children)) return children.map(textOf).join(" ");
	if (children && typeof children === "object" && "t" in children) return String((children as { t: unknown }).t);
	return "section";
}
