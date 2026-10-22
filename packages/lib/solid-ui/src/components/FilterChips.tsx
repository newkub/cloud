/**
 * FilterChips — active filters rendered as removable chips with a clear-all action.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { chipVariants, type Radius, radiusMap } from "../lib/variants";

export interface FilterChip {
	id: string;
	/** Group/field name, e.g. "Status". */
	label: string;
	/** Selected value text, e.g. "Open". */
	value: string;
	disabled?: boolean;
}

export interface FilterChipsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	chips: FilterChip[];
	onRemove?: (chip: FilterChip) => void;
	/** Clear-all button — hidden when omitted or list is empty. */
	onClear?: () => void;
	/** Clear-all label. @default "Clear all" */
	clearLabel?: string;
	/** Render "label: value" or just value. @default true */
	showLabel?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius on chips. */
	radius?: Radius;
	disabled?: boolean;
}

const chipSize = {
	sm: "h-5 text-2xs gap-1 px-1.5",
	md: "h-6 text-xs gap-1.5 px-2",
	lg: "h-7 text-sm gap-2 px-2.5",
} as const;

export function FilterChips(props: FilterChipsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"chips",
		"onRemove",
		"onClear",
		"clearLabel",
		"showLabel",
		"size",
		"radius",
		"disabled",
	]);
	return (
		<Show when={(local.chips ?? []).length}>
			<div class={`solidui-filter-chips flex flex-wrap items-center gap-1.5 ${local.class ?? ""}`.trim()} {...rest}>
				<For each={local.chips ?? []}>
					{(chip) => (
						<span
							class={`inline-flex items-center border ${chipVariants.default} ${chipSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${chip.disabled ? "opacity-50" : ""}`}
						>
							<Show when={local.showLabel ?? true}>
								<span class="text-muted-foreground">{chip.label}:</span>
							</Show>
							<span class="max-w-48 truncate font-medium text-foreground">{chip.value}</span>
							<Show when={local.onRemove && !chip.disabled && !local.disabled}>
								<button
									type="button"
									aria-label={`Remove ${chip.label} filter`}
									class="ml-0.5 flex items-center rounded-full text-muted-foreground motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									onClick={() => local.onRemove?.(chip)}
								>
									<svg
										class="h-3 w-3"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
									</svg>
								</button>
							</Show>
						</span>
					)}
				</For>
				<Show when={local.onClear}>
					<button
						type="button"
						disabled={local.disabled}
						class={`rounded font-medium text-muted-foreground underline-offset-2 motion-safe:transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${local.size === "sm" ? "text-2xs" : "text-xs"}`}
						onClick={() => local.onClear?.()}
					>
						{local.clearLabel ?? "Clear all"}
					</button>
				</Show>
			</div>
		</Show>
	);
}
