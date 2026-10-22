/**
 * BudgetSplitInput - currency budget allocation across named buckets with remaining-balance tracking.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createUniqueId, For, type JSX, Show, splitProps } from "solid-js";

export interface BudgetBucket {
	key: string;
	label: string;
}

export interface BudgetSplitInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Buckets to allocate across. */
	buckets?: BudgetBucket[];
	/** ISO 4217 currency code. @default "USD" */
	currency?: string;
	/** Total budget to allocate. */
	total?: number;
	/** Current amounts keyed by bucket key. */
	value?: Record<string, number>;
	onChange?: (value: Record<string, number>) => void;
	/** Visible group label. */
	label?: JSX.Element;
	/** Helper text under the group. */
	description?: JSX.Element;
	disabled?: boolean;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function BudgetSplitInput(props: BudgetSplitInputProps) {
	const [local, others] = splitProps(props, [
		"buckets",
		"currency",
		"total",
		"value",
		"onChange",
		"label",
		"description",
		"disabled",
	]);
	const { className, rest } = useComponentClasses(others, {
		base: "solidui-budget-split-input w-full",
	});
	const groupId = createUniqueId();
	const buckets = () => local.buckets ?? [];
	const value = () => local.value ?? {};
	const currency = () => local.currency ?? "USD";
	const total = () => local.total ?? 0;
	const allocated = () => buckets().reduce((sum, b) => sum + (value()[b.key] ?? 0), 0);
	const remaining = () => Math.round((total() - allocated()) * 100) / 100;
	const over = () => remaining() < 0;
	const balanced = () => remaining() === 0;

	const fmt = (n: number) => {
		try {
			return new Intl.NumberFormat(undefined, { style: "currency", currency: currency() }).format(n);
		} catch {
			return `${currency()} ${n.toFixed(2)}`;
		}
	};

	const setBucket = (key: string, v: number) => {
		local.onChange?.({ ...value(), [key]: Math.max(0, Math.round(v * 100) / 100) });
	};

	const numberCls = () =>
		"h-8 w-32 rounded border border-input bg-background px-2 text-right text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

	return (
		<div class={className()} {...rest}>
			<Show when={local.label}>
				<span class="mb-1 block text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			{/* biome-ignore lint/a11y/useSemanticElements: labelled input group, not a form fieldset */}
			<div
				class="flex flex-col gap-2"
				role="group"
				aria-label={typeof local.label === "string" ? local.label : "Budget split"}
			>
				<For each={buckets()}>
					{(bucket) => {
						const id = `solidui-budget-${groupId}-${bucket.key}`;
						return (
							<div class="flex items-center justify-between gap-3">
								<label for={id} class="truncate text-sm text-foreground">
									{bucket.label}
								</label>
								<input
									id={id}
									type="number"
									class={numberCls()}
									min={0}
									step="0.01"
									value={value()[bucket.key] ?? 0}
									disabled={local.disabled}
									aria-invalid={over() || undefined}
									aria-describedby={`${groupId}-remaining`}
									onInput={(e) => {
										const v = Number(e.currentTarget.value);
										if (Number.isFinite(v)) setBucket(bucket.key, v);
									}}
								/>
							</div>
						);
					}}
				</For>
				<div class="flex items-center justify-between border-t border-border pt-2 text-sm">
					<span class="text-muted-foreground">
						Allocated <span class="tabular-nums">{fmt(allocated())}</span> of{" "}
						<span class="tabular-nums">{fmt(total())}</span>
					</span>
					<span
						id={`${groupId}-remaining`}
						role={over() ? "alert" : "status"}
						class={`font-medium tabular-nums ${
							over() ? "text-destructive" : balanced() ? "text-success" : "text-muted-foreground"
						}`}
					>
						{over() ? `${fmt(Math.abs(remaining()))} over` : `${fmt(remaining())} remaining`}
					</span>
				</div>
				<Show when={local.description}>
					<p class="text-xs text-muted-foreground">{local.description}</p>
				</Show>
			</div>
		</div>
	);
}
