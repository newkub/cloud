/**
 * ColorPicker — swatch palette with a free-form color input, optional alpha
 * slider and hex/rgb/hsl output formats.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { inputVariants, type Radius, radiusMap } from "../lib/variants";
import { type ColorFormat, formatColor, parseColor, type RGBA } from "./color-picker/color-utils";

export type { ColorFormat, RGBA } from "./color-picker/color-utils";
export { formatColor, parseColor } from "./color-picker/color-utils";

export interface ColorPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Preset swatch colors (hex) — alias: {@link swatches}. */
	colors?: string[];
	/** Preset swatch colors — alias of {@link colors}. */
	swatches?: string[];
	/** Controlled value — emitted in {@link format}. */
	value?: string;
	/** Initial value @default "#3b82f6" */
	defaultValue?: string;
	/** Show the free-form color text input. @default true */
	showInput?: boolean;
	/** Emitted/displayed format. @default "hex" */
	format?: ColorFormat;
	/** Show an alpha slider — emits #rrggbbaa / rgba() / hsla(). @default false */
	withAlpha?: boolean;
	/** Show a × button that clears the value to "". */
	clearable?: boolean;
	/** Called after a clear. */
	onClear?: () => void;
	/** Swatch size. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Called with the color in {@link format} — "" when cleared. */
	onChange?: (color: string) => void;
	/** Disable swatches, input and slider. */
	disabled?: boolean;
	/** Optional field label rendered above. */
	label?: string;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const swatchSize = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-9 w-9" } as const;
const DEFAULT_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#0ea5e9", "#3b82f6", "#a855f7", "#ec4899", "#64748b"];

export function ColorPicker(props: ColorPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"colors",
		"swatches",
		"value",
		"defaultValue",
		"showInput",
		"format",
		"withAlpha",
		"clearable",
		"onClear",
		"size",
		"onChange",
		"disabled",
		"label",
		"error",
		"radius",
		"fullWidth",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "#3b82f6");
	const value = () => local.value ?? internal();
	const parsed = () => parseColor(value()) ?? { r: 0, g: 0, b: 0, a: 1 };
	const format = () => local.format ?? "hex";

	const select = (c: string) => {
		setInternal(c);
		local.onChange?.(c);
	};
	/** Emit the parsed color normalized to the active format. */
	const emit = (c: RGBA) => select(formatColor(c, format(), local.withAlpha ?? false));
	const setAlpha = (pct: number) => emit({ ...parsed(), a: pct / 100 });

	/** Compare a swatch against the current value regardless of format. */
	const sameColor = (a: string, b: string) => {
		const pa = parseColor(a);
		const pb = parseColor(b);
		if (pa && pb) return pa.r === pb.r && pa.g === pb.g && pa.b === pb.b;
		return a.toLowerCase() === b.toLowerCase();
	};

	return (
		<div
			class={`solidui-color-picker inline-flex flex-col gap-2 ${local.class ?? ""}`.trim()}
			aria-invalid={local.error ? true : undefined}
			{...rest}
		>
			<Show when={local.label}>
				<span class="text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			<div class="flex items-center gap-1.5">
				<div class="flex flex-wrap gap-1.5" role="listbox" aria-label="Color swatches">
					<For each={local.swatches ?? local.colors ?? DEFAULT_COLORS}>
						{(c) => (
							<button
								type="button"
								role="option"
								aria-selected={sameColor(value(), c)}
								aria-label={c}
								disabled={local.disabled}
								class={`${swatchSize[local.size ?? "md"]} border transition-transform motion-safe:hover:scale-110 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
									sameColor(value(), c) ? "border-foreground ring-1 ring-ring" : "border-border"
								} ${radiusMap[local.radius ?? "md"]} ${local.fullWidth ? "w-full" : ""}`}
								style={{ "background-color": c }}
								onClick={() => emit({ ...(parseColor(c) ?? { r: 0, g: 0, b: 0 }), a: parsed().a })}
							/>
						)}
					</For>
				</div>
				<Show when={local.clearable && value() && !local.disabled}>
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
			<Show when={local.withAlpha}>
				<label class="flex items-center gap-2 text-2xs text-muted-foreground">
					Alpha
					<input
						type="range"
						min={0}
						max={100}
						value={Math.round(parsed().a * 100)}
						disabled={local.disabled}
						aria-label="Alpha"
						class="h-1.5 w-32 cursor-pointer accent-primary disabled:opacity-50"
						onInput={(e) => setAlpha(Number(e.currentTarget.value))}
					/>
					<span class="font-mono tabular-nums">{Math.round(parsed().a * 100)}%</span>
				</label>
			</Show>
			<Show when={local.showInput ?? true}>
				<input
					type="text"
					value={value()}
					disabled={local.disabled}
					onInput={(e) => select(e.currentTarget.value)}
					class={`h-8 w-32 max-w-full rounded-md border px-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${inputVariants.default} ${local.error ? "border-destructive" : ""}`}
					aria-label="Color value"
				/>
			</Show>
			<Show when={typeof local.error === "string" && local.error}>
				<p role="alert" class="text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
