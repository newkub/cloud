/**
 * Figure — media with a caption (figcaption).
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface FigureProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Caption under the media */
	caption?: string;
	/** Caption alignment @default "center" */
	align?: "left" | "center" | "right";
	/** Frame the media in a bordered card @default true */
	framed?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const;

export function Figure(props: FigureProps) {
	const [local, rest] = splitProps(props, ["class", "children", "caption", "align", "framed", "radius"]);
	return (
		<figure class={`solidui-figure ${local.class ?? ""}`.trim()} {...rest}>
			<div
				class={
					(local.framed ?? true)
						? `overflow-hidden border border-border bg-muted/30 [&>img]:w-full ${radiusMap[local.radius ?? "lg"]}`
						: undefined
				}
			>
				{local.children}
			</div>
			<Show when={local.caption}>
				<figcaption class={`mt-2 text-xs text-muted-foreground ${alignClass[local.align ?? "center"]}`}>
					{local.caption}
				</figcaption>
			</Show>
		</figure>
	);
}
