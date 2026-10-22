/**
 * SpecSheet — spec table grouped into titled sections of name/value rows.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SpecSheetSpec {
	/** Spec name */
	name: string;
	/** Spec value */
	value: string | number;
	/** Unit appended after the value */
	unit?: string;
}

export interface SpecSheetSection {
	/** Optional section heading */
	title?: string;
	/** Specs in this section */
	specs: SpecSheetSpec[];
}

export interface SpecSheetProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Sections of specs to render */
	sections: SpecSheetSection[];
	/** Draw a row divider between specs @default true */
	bordered?: boolean;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const rowPad = { sm: "py-1.5", md: "py-2", lg: "py-2.5" } as const;

export function SpecSheet(props: SpecSheetProps) {
	const [local, rest] = splitProps(props, ["class", "sections", "bordered", "size", "radius"]);
	return (
		<div
			class={`solidui-spec-sheet overflow-hidden border border-border bg-surface text-foreground ${radiusMap[local.radius ?? "lg"]} ${textSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.sections}>
				{(section, s) => (
					<section class={s() > 0 ? "border-t border-border" : ""}>
						<Show when={section.title}>
							<h3 class="bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								{section.title}
							</h3>
						</Show>
						<dl class="px-4">
							<For each={section.specs}>
								{(spec, i) => (
									<div
										class={`flex items-baseline justify-between gap-4 ${rowPad[local.size ?? "md"]} ${(local.bordered ?? true) && i() < section.specs.length - 1 ? "border-b border-border" : ""}`}
									>
										<dt class="text-muted-foreground">{spec.name}</dt>
										<dd class="text-right font-medium tabular-nums text-foreground">
											{spec.value}
											<Show when={spec.unit}>
												<span class="ml-1 text-muted-foreground">{spec.unit}</span>
											</Show>
										</dd>
									</div>
								)}
							</For>
						</dl>
					</section>
				)}
			</For>
		</div>
	);
}
