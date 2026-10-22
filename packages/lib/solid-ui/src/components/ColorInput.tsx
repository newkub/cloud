/**
 * ColorInput — compact native color well + formatted value readout.
 * Supports preset swatches (via datalist), hex/rgb/hsl output, an alpha
 * slider and a clear button.
 */
import { createSignal, createUniqueId, For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";
import { type ColorFormat, formatColor, parseColor } from "./ColorPicker";

const sizeMap: Record<ControlSize, string> = {
	sm: "p-0.5 pr-2",
	md: "p-1 pr-3",
	lg: "p-1.5 pr-4",
};

export interface ColorInputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"value" | "defaultValue" | "onChange" | "onInput" | "type" | "size"
	> {
	/** Controlled color value — emitted in {@link format}. */
	value?: string;
	/** Initial value. @default "#000000" */
	defaultValue?: string;
	/** Visual style of the frame. @default "default" */
	variant?: InputVariant;
	/** Control size. @default "md" */
	size?: ControlSize;
	/** Called with the color in {@link format} — "" when cleared. */
	onChange?: (value: string) => void;
	/** Show the formatted value next to the well. @default true */
	showText?: boolean;
	/** Emitted/displayed format. @default "hex" */
	format?: ColorFormat;
	/** Show an alpha slider — emits #rrggbbaa / rgba() / hsla(). @default false */
	withAlpha?: boolean;
	/** Suggested swatches offered by the native picker (datalist). */
	swatches?: string[];
	/** Show a × button that clears the value to "". */
	clearable?: boolean;
	/** Called after a clear. */
	onClear?: () => void;
	/** Optional field label rendered above. */
	label?: string;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function ColorInput(props: ColorInputProps) {
	const merged = mergeProps({ defaultValue: "#000000" }, props);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const uid = createUniqueId();
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"showText",
		"format",
		"withAlpha",
		"swatches",
		"clearable",
		"onClear",
		"label",
		"error",
		"fullWidth",
		"disabled",
		"readOnly",
		"required",
		"radius",
		"id",
		"name",
	]);

	const value = () => (local.value !== undefined ? local.value : internal());
	const parsed = () => parseColor(value()) ?? { r: 0, g: 0, b: 0, a: 1 };
	/** The native color input only understands #rrggbb — strip alpha. */
	const wellHex = () => formatColor({ ...parsed(), a: 1 }, "hex", false);
	const format = () => local.format ?? "hex";
	const inputId = () => local.id ?? `solidui-color-input-${uid}`;
	const listId = () => `${inputId()}-swatches`;

	const setValue = (next: string) => {
		setInternal(next);
		local.onChange?.(next);
	};
	const emitHex = (hex: string) => {
		if (local.readOnly) return;
		const c = parseColor(hex);
		if (!c) return;
		setValue(formatColor({ ...c, a: parsed().a }, format(), local.withAlpha ?? false));
	};

	const className = () =>
		[
			"inline-flex items-center gap-2 border transition-colors motion-reduce:transition-none",
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			local.disabled ? "opacity-50" : "",
			local.error ? "border-destructive" : "",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const errorId = () => `${inputId()}-error`;

	return (
		<div class={`solidui-color-input ${local.fullWidth ? "w-full" : "inline-block"}`}>
			<Show when={local.label}>
				<label for={inputId()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div class={className()} aria-invalid={local.error ? true : undefined}>
				<label
					class="relative block h-7 w-10 cursor-pointer overflow-hidden rounded focus-within:ring-2 focus-within:ring-ring has-[:disabled]:cursor-not-allowed"
					style={{ "background-color": wellHex() }}
				>
					<input
						{...rest}
						id={inputId()}
						name={local.name}
						type="color"
						list={local.swatches?.length ? listId() : undefined}
						value={wellHex()}
						disabled={local.disabled}
						required={local.required}
						class="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 opacity-0 focus-visible:outline-none disabled:cursor-not-allowed"
						aria-label={local.label ?? "Choose color"}
						aria-describedby={typeof local.error === "string" ? errorId() : undefined}
						onInput={(e) => emitHex(e.currentTarget.value)}
					/>
				</label>
				<Show when={local.swatches?.length}>
					<datalist id={listId()}>
						<For each={local.swatches}>{(c) => <option value={c} />}</For>
					</datalist>
				</Show>
				<Show when={local.withAlpha}>
					<input
						type="range"
						min={0}
						max={100}
						value={Math.round(parsed().a * 100)}
						disabled={local.disabled || local.readOnly}
						aria-label="Alpha"
						class="h-1.5 w-16 cursor-pointer accent-primary disabled:opacity-50"
						onInput={(e) =>
							setValue(formatColor({ ...parsed(), a: Number(e.currentTarget.value) / 100 }, format(), true))
						}
					/>
				</Show>
				{(local.showText ?? true) && (
					<span class="font-mono text-xs text-muted-foreground">
						{value() ? formatColor(parsed(), format(), local.withAlpha ?? false) : "—"}
					</span>
				)}
				<Show when={local.clearable && value() && !local.disabled && !local.readOnly}>
					<button
						type="button"
						aria-label="Clear color"
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => {
							setInternal("");
							local.onChange?.("");
							local.onClear?.();
						}}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</Show>
			</div>
			<Show when={typeof local.error === "string" && local.error}>
				<p id={errorId()} role="alert" class="mt-1 text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
