/**
 * FieldList — definition-style field list with stacked or inline label/value layout.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface FieldListItem {
	/** Field label */
	label: string;
	/** Field value — any element */
	value: JSX.Element;
	/** Footnote under the value */
	hint?: string;
}

export interface FieldListProps extends JSX.HTMLAttributes<HTMLDListElement> {
	/** Fields to display */
	fields: FieldListItem[];
	/** Number of columns @default 1 */
	columns?: 1 | 2;
	/** Label/value arrangement @default "stacked" */
	layout?: "stacked" | "inline";
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
}

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const gap = { sm: "gap-3", md: "gap-4", lg: "gap-5" } as const;

export function FieldList(props: FieldListProps) {
	const [local, rest] = splitProps(props, ["class", "fields", "columns", "layout", "size"]);
	return (
		<dl
			class={`solidui-field-list grid ${(local.columns ?? 1) === 2 ? "sm:grid-cols-2" : "grid-cols-1"} ${gap[local.size ?? "md"]} ${textSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.fields}>
				{(field) => (
					<div class={local.layout === "inline" ? "flex items-baseline justify-between gap-3" : "min-w-0"}>
						<dt class="text-muted-foreground">{field.label}</dt>
						<dd
							class={
								local.layout === "inline"
									? "truncate text-right font-medium text-foreground"
									: "mt-0.5 font-medium text-foreground"
							}
						>
							{field.value}
						</dd>
						<Show when={field.hint}>
							<dd class="mt-0.5 w-full text-xs text-muted-foreground">{field.hint}</dd>
						</Show>
					</div>
				)}
			</For>
		</dl>
	);
}
