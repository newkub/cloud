/**
 * NumberInput — numeric field with min/max/step, prefix/suffix and error states.
 * Props live in `./number-input/types`, size maps in `./number-input/styles`.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { inputVariants, radiusMap } from "../lib/variants";
import { padLeft, padRight, sizeMap } from "./number-input/styles";
import type { NumberInputProps } from "./number-input/types";

export type { NumberInputProps } from "./number-input/types";

let numberInputId = 0;

export function NumberInput(props: NumberInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"onBlur",
		"min",
		"max",
		"step",
		"clampOutOfRange",
		"prefix",
		"suffix",
		"allowDecimal",
		"hideControls",
		"controls",
		"decreaseLabel",
		"increaseLabel",
		"fullWidth",
		"error",
		"description",
		"radius",
	]);
	const autoId = `solidui-number-${++numberInputId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal<number | string>(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	let inputRef: HTMLInputElement | undefined;

	const clamp = (n: number) =>
		Math.min(local.max ?? Number.POSITIVE_INFINITY, Math.max(local.min ?? Number.NEGATIVE_INFINITY, n));

	const emit = (v: number | string) => {
		if (local.value === undefined) setInternal(v);
		local.onChange?.(v);
	};

	const controls = () => local.controls ?? (local.hideControls ? "none" : "native");
	const stepBy = (dir: 1 | -1) => {
		const n = Number(value());
		emit(clamp((Number.isNaN(n) ? 0 : n) + dir * (local.step ?? 1)));
	};

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		let raw = e.currentTarget.value;
		if (raw !== "" && local.allowDecimal === false) {
			raw = raw.replace(/[.,]/g, "");
			if (raw !== e.currentTarget.value) e.currentTarget.value = raw;
		}
		emit(raw === "" ? "" : Number(raw));
		if (typeof local.onInput === "function") {
			local.onInput(e);
		}
	};

	const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		if (local.clampOutOfRange !== false) {
			const n = Number(e.currentTarget.value);
			if (e.currentTarget.value !== "" && !Number.isNaN(n)) {
				const clamped = clamp(n);
				if (clamped !== n) {
					e.currentTarget.value = String(clamped);
					emit(clamped);
				}
			}
		}
		if (typeof local.onBlur === "function") {
			local.onBlur(e as FocusEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement });
		}
	};

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"flex w-full border transition-colors motion-reduce:transition-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			local.prefix ? padLeft[local.size ?? "md"] : "",
			local.suffix ? padRight[local.size ?? "md"] : "",
			controls() !== "native"
				? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				: "",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const field = (
		<input
			id={id()}
			ref={inputRef}
			type="number"
			inputMode={local.allowDecimal === false ? "numeric" : "decimal"}
			class={className()}
			value={value()}
			min={local.min}
			max={local.max}
			step={local.step}
			onInput={handleInput}
			onBlur={handleBlur}
			aria-invalid={invalid() || undefined}
			aria-describedby={describedBy()}
			{...rest}
		/>
	);

	const decorated = () => !!(local.prefix || local.suffix || errorText() || local.description);

	if (controls() === "buttons") {
		const btnSize = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-10 w-10" }[local.size ?? "md"];
		const btnClass = `flex shrink-0 items-center justify-center text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${btnSize}`;
		const numValue = () => Number(value());
		const group = (
			<div
				class={`inline-flex items-center border ${inputVariants[local.variant ?? "default"]} ${invalid() ? "border-destructive" : ""} ${radiusMap[local.radius ?? "md"]} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			>
				<button
					type="button"
					class={`${btnClass} rounded-l-md border-r border-input`}
					aria-label={local.decreaseLabel ?? "Decrease"}
					disabled={props.disabled || (local.min !== undefined && numValue() <= local.min)}
					onClick={() => stepBy(-1)}
				>
					−
				</button>
				<Show when={local.prefix}>
					<span class="pl-2 text-sm text-muted-foreground">{local.prefix}</span>
				</Show>
				<input
					id={id()}
					ref={inputRef}
					type="number"
					inputMode={local.allowDecimal === false ? "numeric" : "decimal"}
					class={`w-full min-w-0 border-0 bg-transparent px-2 text-center text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${sizeMap[local.size ?? "md"]}`}
					value={value()}
					min={local.min}
					max={local.max}
					step={local.step}
					disabled={props.disabled}
					onInput={handleInput}
					onBlur={handleBlur}
					aria-invalid={invalid() || undefined}
					aria-describedby={describedBy()}
					{...rest}
				/>
				<Show when={local.suffix}>
					<span class="pr-2 text-sm text-muted-foreground">{local.suffix}</span>
				</Show>
				<button
					type="button"
					class={`${btnClass} rounded-r-md border-l border-input`}
					aria-label={local.increaseLabel ?? "Increase"}
					disabled={props.disabled || (local.max !== undefined && numValue() >= local.max)}
					onClick={() => stepBy(1)}
				>
					+
				</button>
			</div>
		);
		return (
			<Show when={local.description || errorText()} fallback={group}>
				<div class={local.fullWidth ? "w-full" : "inline-flex flex-col"}>
					{group}
					<Show when={local.description}>
						<p id={`${id()}-desc`} class="mt-1 text-xs text-muted-foreground">
							{local.description}
						</p>
					</Show>
					<Show when={errorText()}>
						<p id={`${id()}-error`} role="alert" class="mt-1 text-xs text-destructive">
							{errorText()}
						</p>
					</Show>
				</div>
			</Show>
		);
	}

	return (
		<Show when={decorated()} fallback={field}>
			<div class="w-full">
				<div class="relative">
					<Show when={local.prefix}>
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
							{local.prefix}
						</span>
					</Show>
					{field}
					<Show when={local.suffix}>
						<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
							{local.suffix}
						</span>
					</Show>
				</div>
				<Show when={local.description}>
					<p id={`${id()}-desc`} class="mt-1 text-xs text-muted-foreground">
						{local.description}
					</p>
				</Show>
				<Show when={errorText()}>
					<p id={`${id()}-error`} role="alert" class="mt-1 text-xs text-destructive">
						{errorText()}
					</p>
				</Show>
			</div>
		</Show>
	);
}
