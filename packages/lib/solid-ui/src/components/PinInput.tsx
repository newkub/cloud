/**
 * Multi-input pin or OTP entry
 */
import { createSignal, Index, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 w-8 text-sm",
	md: "h-10 w-10 text-lg",
	lg: "h-12 w-12 text-xl",
};

const gapMap: Record<ControlSize, string> = {
	sm: "gap-1.5",
	md: "gap-2",
	lg: "gap-3",
};

export interface PinInputProps extends Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
	/** Number of cells. @default 4 */
	length?: number;
	value?: string;
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	inputClass?: string;
	/** Mask each cell as a password dot. @default false */
	mask?: boolean;
	/** Hint one-time-code autofill — sets autocomplete="one-time-code" on the first cell. @default false */
	otp?: boolean;
	/** Accepted character set — filters invalid characters. @default "alphanumeric" */
	type?: "numeric" | "alphanumeric";
	/** Placeholder shown in empty cells. */
	placeholder?: string;
	/** Disable every cell. */
	disabled?: boolean;
	/** Error state — `true` marks the cells invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Corner radius of each digit cell. @default "md" */
	radius?: Radius;
}

let pinInputId = 0;

const DEFAULT_PIN_INPUT_PROPS = { length: 4, defaultValue: "", type: "alphanumeric" as const };

const PIN_INPUT_LOCAL_KEYS = [
	"class",
	"variant",
	"size",
	"length",
	"value",
	"defaultValue",
	"onChange",
	"onComplete",
	"inputClass",
	"mask",
	"otp",
	"type",
	"placeholder",
	"disabled",
	"error",
	"radius",
] as const;

function usePinInputState(props: PinInputProps) {
	const merged = mergeProps(DEFAULT_PIN_INPUT_PROPS, props);
	const [local, rest] = splitProps(merged, PIN_INPUT_LOCAL_KEYS);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const baseId = `pininput-${++pinInputId}`;
	const inputRefs: HTMLInputElement[] = [];
	const value = () => (local.value !== undefined ? local.value : internal());
	const chars = () => {
		const list = value().split("").slice(0, local.length);
		while (list.length < local.length) list.push("");
		return list;
	};
	const isComplete = (next: string) => next.length === local.length && [...next].every((c) => c !== "");
	const sanitize = (raw: string) =>
		local.type === "alphanumeric" ? raw.replace(/[^a-zA-Z0-9]/g, "") : raw.replace(/\D/g, "");
	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const className = () =>
		["m-0 flex min-w-0 items-center border-0 p-0", gapMap[local.size ?? "md"], local.class ?? ""]
			.filter(Boolean)
			.join(" ");
	const inputClassName = () =>
		[
			"border text-center font-semibold text-foreground transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.inputClass ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return {
		local,
		rest,
		baseId,
		inputRefs,
		value,
		chars,
		isComplete,
		sanitize,
		invalid,
		errorText,
		setInternal,
		className,
		inputClassName,
	};
}

type PinInputState = ReturnType<typeof usePinInputState>;

function usePinInputHelpers(state: PinInputState) {
	function update(next: string) {
		const clamped = next.slice(0, state.local.length);
		if (state.local.value === undefined) state.setInternal(clamped);
		state.local.onChange?.(clamped);
		if (state.isComplete(clamped)) {
			state.local.onComplete?.(clamped);
		}
	}
	const setChar = (index: number, char: string) => {
		const list = state.chars();
		list[index] = char.slice(-1);
		update(list.join(""));
	};
	const focusNext = (index: number) => {
		if (index < state.local.length - 1) {
			state.inputRefs[index + 1]?.focus();
			state.inputRefs[index + 1]?.select();
		}
	};
	const focusPrev = (index: number) => {
		if (index > 0) {
			state.inputRefs[index - 1]?.focus();
			state.inputRefs[index - 1]?.select();
		}
	};
	const clear = (index: number) => {
		const list = state.chars();
		list[index] = "";
		update(list.join(""));
	};
	return { setChar, focusNext, focusPrev, clear, update };
}

function usePinInputHandlers(state: PinInputState, helpers: ReturnType<typeof usePinInputHelpers>) {
	const onInput = (index: number, e: InputEvent & { currentTarget: HTMLInputElement }) => {
		const newValue = state.sanitize(e.currentTarget.value);
		if (!newValue) {
			if (e.currentTarget.value) e.currentTarget.value = state.chars()[index];
			return;
		}
		helpers.setChar(index, newValue);
		helpers.focusNext(index);
	};
	const onKeyDown = (index: number, e: KeyboardEvent) => {
		if (e.key === "Backspace") {
			e.preventDefault();
			if (state.chars()[index]) {
				helpers.clear(index);
			} else {
				helpers.focusPrev(index);
			}
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			helpers.focusPrev(index);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			helpers.focusNext(index);
		}
	};
	const onPaste = (e: ClipboardEvent & { currentTarget: HTMLInputElement }) => {
		e.preventDefault();
		const text = e.clipboardData?.getData("text");
		if (!text) return;
		const clean = state.sanitize(text.replace(/\s/g, "")).slice(0, state.local.length);
		const list = state.chars();
		for (let i = 0; i < clean.length; i++) {
			if (i < state.local.length) list[i] = clean[i];
		}
		helpers.update(list.join(""));
		const lastIndex = Math.min(clean.length, state.local.length) - 1;
		if (lastIndex >= 0) {
			state.inputRefs[lastIndex]?.focus();
			state.inputRefs[lastIndex]?.select();
		}
	};
	return { onInput, onKeyDown, onPaste };
}

function usePinInput(props: PinInputProps) {
	const state = usePinInputState(props);
	const helpers = usePinInputHelpers(state);
	const handlers = usePinInputHandlers(state, helpers);
	return { ...state, ...helpers, ...handlers };
}

export function PinInput(props: PinInputProps) {
	const ctx = usePinInput(props);

	return (
		<fieldset class={ctx.className()} aria-label="Pin input" {...ctx.rest}>
			<Index each={ctx.chars()}>
				{(char, index) => {
					const i = index;
					return (
						<input
							id={`${ctx.baseId}-${i}`}
							ref={(el) => (ctx.inputRefs[i] = el)}
							type={ctx.local.mask ? "password" : "text"}
							inputMode={ctx.local.type === "numeric" ? "numeric" : "text"}
							autocomplete={i === 0 && ctx.local.otp ? "one-time-code" : undefined}
							maxLength={1}
							placeholder={ctx.local.placeholder}
							disabled={ctx.local.disabled}
							value={char()}
							onInput={(e) => ctx.onInput(i, e as InputEvent & { currentTarget: HTMLInputElement })}
							onKeyDown={(e) => ctx.onKeyDown(i, e)}
							onPaste={(e) => ctx.onPaste(e as ClipboardEvent & { currentTarget: HTMLInputElement })}
							class={ctx.inputClassName()}
							aria-label={`Pin digit ${i + 1} of ${ctx.local.length}`}
							aria-invalid={ctx.invalid() || undefined}
						/>
					);
				}}
			</Index>
			<Show when={ctx.errorText()}>
				<p role="alert" class="basis-full text-xs text-destructive">
					{ctx.errorText()}
				</p>
			</Show>
		</fieldset>
	);
}
