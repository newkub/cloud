/**
 * Controlled text input with optional sections, clear button, loading and error states.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";
import { Spinner } from "./Spinner";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

const padLeft: Record<ControlSize, string> = {
	sm: "pl-8",
	md: "pl-9",
	lg: "pl-10",
};

const padRight: Record<ControlSize, string> = {
	sm: "pr-8",
	md: "pr-9",
	lg: "pr-10",
};

const padRightWide: Record<ControlSize, string> = {
	sm: "pr-14",
	md: "pr-16",
	lg: "pr-18",
};

let inputId = 0;

export interface InputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "value" | "size"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep behavior only. @default false */
	unstyled?: boolean;
	/** Content rendered inside the left edge of the field (icon, text, …). */
	leftSection?: JSX.Element;
	/** Alias for `leftSection` — semantic slot for an icon. */
	leftIcon?: JSX.Element;
	/** Content rendered inside the right edge of the field. */
	rightSection?: JSX.Element;
	/** Show an × button that empties the field when it has a value. @default false */
	clearable?: boolean;
	/** Called after the clear button empties the field. */
	onClear?: () => void;
	/** Accessible label for the clear button. @default "Clear input" */
	clearLabel?: string;
	/** Show a spinner inside the right edge of the field. @default false */
	loading?: boolean;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
}

export function Input(props: InputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"radius",
		"unstyled",
		"leftSection",
		"leftIcon",
		"rightSection",
		"clearable",
		"onClear",
		"clearLabel",
		"loading",
		"error",
		"description",
		"disabled",
		"readOnly",
	]);
	const autoId = `solidui-input-${++inputId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	let inputRef: HTMLInputElement | undefined;

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") {
			local.onInput(e);
		}
	};

	const handleClear = () => {
		setInternal("");
		local.onChange?.("");
		local.onClear?.();
		inputRef?.focus();
	};

	const left = () => local.leftSection ?? local.leftIcon;
	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const showClear = () => !!local.clearable && value() !== "" && !local.disabled && !local.readOnly;
	const rightCount = () => (local.rightSection ? 1 : 0) + (showClear() ? 1 : 0) + (local.loading ? 1 : 0);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"flex w-full border transition-colors motion-reduce:transition-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					base,
					inputVariants[local.variant ?? "default"],
					sizeMap[local.size ?? "md"],
					left() ? padLeft[local.size ?? "md"] : "",
					rightCount() > 1 ? padRightWide[local.size ?? "md"] : rightCount() === 1 ? padRight[local.size ?? "md"] : "",
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	const field = (
		<input
			id={id()}
			ref={inputRef}
			class={className()}
			type="text"
			value={value()}
			onInput={handleInput}
			aria-invalid={invalid() || undefined}
			aria-describedby={describedBy()}
			disabled={local.disabled}
			readOnly={local.readOnly}
			{...rest}
		/>
	);

	const decorated = () => !!(left() || rightCount() || errorText() || local.description);

	const sectionCls =
		"pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground [&>*]:pointer-events-auto";

	return (
		<Show when={decorated()} fallback={field}>
			<div class="w-full">
				<div class="relative">
					<Show when={left()}>
						<span class={sectionCls}>{left()}</span>
					</Show>
					{field}
					<Show when={rightCount() > 0}>
						<span class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2.5 text-muted-foreground">
							<Show when={local.loading}>
								<Spinner size="sm" variant="muted" />
							</Show>
							<Show when={showClear()}>
								<button
									type="button"
									class="rounded p-0.5 transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									aria-label={local.clearLabel ?? "Clear input"}
									onClick={handleClear}
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
							{local.rightSection}
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
