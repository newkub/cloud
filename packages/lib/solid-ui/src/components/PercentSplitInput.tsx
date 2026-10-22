/**
 * PercentSplitInput - percentage allocation across named buckets with a total bar that must reach 100%.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createUniqueId, For, type JSX, Show, splitProps } from "solid-js";

export interface PercentBucket {
	key: string;
	label: string;
}

export interface PercentSplitInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Buckets to allocate across. */
	buckets?: PercentBucket[];
	/** Current percentages keyed by bucket key. */
	value?: Record<string, number>;
	onChange?: (value: Record<string, number>) => void;
	/** Visible group label. */
	label?: JSX.Element;
	/** Helper text under the group. */
	description?: JSX.Element;
	/** Override the total error message. */
	errorMessage?: string;
	disabled?: boolean;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const clamp100 = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

export function PercentSplitInput(props: PercentSplitInputProps) {
	const [local, others] = splitProps(props, [
		"buckets",
		"value",
		"onChange",
		"label",
		"description",
		"errorMessage",
		"disabled",
	]);
	const { className, rest } = useComponentClasses(others, {
		base: "solidui-percent-split-input w-full",
	});
	const groupId = createUniqueId();
	const buckets = () => local.buckets ?? [];
	const value = () => local.value ?? {};
	const total = () => buckets().reduce((sum, b) => sum + (value()[b.key] ?? 0), 0);
	const balanced = () => total() === 100;
	const over = () => total() > 100;

	const setBucket = (key: string, v: number) => {
		local.onChange?.({ ...value(), [key]: clamp100(v) });
	};

	const numberCls = () =>
		"h-8 w-16 rounded border border-input bg-background px-1.5 text-right text-xs tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

	return (
		<div class={className()} {...rest}>
			<Show when={local.label}>
				<span class="mb-1 block text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			{/* biome-ignore lint/a11y/useSemanticElements: labelled input group, not a form fieldset */}
			<div
				class="flex flex-col gap-2"
				role="group"
				aria-label={typeof local.label === "string" ? local.label : "Percentage split"}
			>
				<For each={buckets()}>
					{(bucket) => {
						const id = `solidui-percent-${groupId}-${bucket.key}`;
						return (
							<div class="flex items-center gap-3">
								<label for={id} class="w-28 shrink-0 truncate text-sm text-foreground">
									{bucket.label}
								</label>
								<input
									type="range"
									class="h-1.5 flex-1 accent-primary disabled:cursor-not-allowed disabled:opacity-50"
									min={0}
									max={100}
									step={1}
									value={value()[bucket.key] ?? 0}
									disabled={local.disabled}
									aria-label={`${bucket.label} percent slider`}
									aria-describedby={balanced() ? undefined : `${groupId}-total`}
									onInput={(e) => setBucket(bucket.key, Number(e.currentTarget.value))}
								/>
								<span class="relative">
									<input
										id={id}
										type="number"
										class={`${numberCls()} pr-5`}
										min={0}
										max={100}
										value={value()[bucket.key] ?? 0}
										disabled={local.disabled}
										aria-invalid={over() || undefined}
										aria-describedby={balanced() ? undefined : `${groupId}-total`}
										onInput={(e) => {
											const v = Number(e.currentTarget.value);
											if (Number.isFinite(v)) setBucket(bucket.key, v);
										}}
									/>
									<span class="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-2xs text-muted-foreground">
										%
									</span>
								</span>
							</div>
						);
					}}
				</For>
				<div>
					<div
						class="h-1.5 w-full overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-valuenow={total()}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="Total allocation"
					>
						<div
							class={`h-full transition-[width] motion-reduce:transition-none ${
								balanced() ? "bg-success" : over() ? "bg-destructive" : "bg-primary"
							}`}
							style={{ width: `${Math.min(100, total())}%` }}
						/>
					</div>
					<Show
						when={balanced()}
						fallback={
							<p id={`${groupId}-total`} role="alert" class="mt-1 text-xs text-destructive">
								{local.errorMessage ?? `Total must be 100% — currently ${total()}%`}
							</p>
						}
					>
						<p id={`${groupId}-total`} role="status" class="mt-1 text-xs text-success">
							Total: 100%
						</p>
					</Show>
					<Show when={local.description}>
						<p class="mt-1 text-xs text-muted-foreground">{local.description}</p>
					</Show>
				</div>
			</div>
		</div>
	);
}
