/**
 * Heading — semantic h1–h6 with independent visual size and optional anchor link.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { type Radius, radiusMap } from "../lib/variants";

export interface HeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
	/** Semantic level → element tag @default 2 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Visual size — decoupled from level @default matches level */
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	/** Render a # anchor link on hover (requires `id`) */
	anchor?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const levelSize: Record<number, NonNullable<HeadingProps["size"]>> = {
	1: "2xl",
	2: "xl",
	3: "lg",
	4: "md",
	5: "sm",
	6: "xs",
};
const sizeClass = {
	xs: "text-sm font-semibold",
	sm: "text-base font-semibold",
	md: "text-lg font-semibold",
	lg: "text-xl font-semibold",
	xl: "text-2xl font-bold",
	"2xl": "text-3xl font-bold tracking-tight",
} as const;

export function Heading(props: HeadingProps) {
	const [local, rest] = splitProps(props, ["class", "children", "level", "size", "anchor", "id", "radius"]);
	const level = () => local.level ?? 2;
	const Tag = () => `h${level()}` as const;
	return (
		<Dynamic
			component={Tag()}
			id={local.id}
			class={`solidui-heading group ${sizeClass[local.size ?? levelSize[level()]]} ${local.radius ? radiusMap[local.radius] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
			<Show when={local.anchor && local.id}>
				<a
					href={`#${local.id}`}
					aria-label="Link to heading"
					class="ml-2 rounded text-muted-foreground opacity-0 motion-safe:transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					#
				</a>
			</Show>
		</Dynamic>
	);
}
