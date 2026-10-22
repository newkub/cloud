/**
 * Select - dropdown select with clear and invalid states.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

export interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value" | "size"> {
	value?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	/** Placeholder option rendered when `value` is empty. */
	placeholder?: string;
	/** Show a clear (×) button that resets the value to `""`. @default false */
	clearable?: boolean;
	/** Accessible label for the clear button. @default "Clear selection" */
	clearLabel?: string;
	/** Called after the value is cleared via the clear button. */
	onClear?: () => void;
	/** Marks the control invalid — destructive border + `aria-invalid`. @default false */
	invalid?: boolean;
	/** Stretch the control to the container width. @default true */
	fullWidth?: boolean;
	/** Busy state — disables the control and sets `data-loading`/`aria-busy`. @default false */
	loading?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function Select(props: SelectProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"value",
		"onChange",
		"disabled",
		"placeholder",
		"clearable",
		"clearLabel",
		"onClear",
		"invalid",
		"fullWidth",
		"loading",
		"radius",
	]);

	const handleChange: JSX.EventHandler<HTMLSelectElement, Event> = (e) => {
		local.onChange?.(e.currentTarget.value);
	};

	const clear = () => {
		local.onChange?.("");
		local.onClear?.();
	};

	const base =
		"flex cursor-pointer border transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			(local.fullWidth ?? true) ? "w-full" : "",
			local.clearable ? "pr-8" : "",
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const select = (
		<select
			class={className()}
			value={local.value}
			onChange={handleChange}
			disabled={local.disabled || local.loading}
			aria-invalid={local.invalid || undefined}
			aria-busy={local.loading || undefined}
			data-invalid={local.invalid || undefined}
			data-loading={local.loading || undefined}
			{...rest}
		>
			<Show when={local.placeholder}>
				<option value="" disabled={!local.clearable} hidden={!local.clearable}>
					{local.placeholder}
				</option>
			</Show>
			{local.children}
		</select>
	);

	return (
		<Show when={local.clearable} fallback={select}>
			<div class="relative">
				{select}
				<Show when={local.value && !local.disabled && !local.loading}>
					<button
						type="button"
						aria-label={local.clearLabel ?? "Clear selection"}
						class="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={clear}
					>
						×
					</button>
				</Show>
			</div>
		</Show>
	);
}
