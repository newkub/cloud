/**
 * StepperInput — numeric field with −/+ step buttons.
 * @deprecated Use `NumberInput` with `controls="buttons"` — it adds `description`,
 * `id`/`aria-describedby` plumbing and a "none" controls mode.
 */
import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../lib/variants";
import { NumberInput } from "./NumberInput";

export interface StepperInputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "onInput" | "value" | "size" | "min" | "max" | "step" | "prefix"
	> {
	/** Controlled value. */
	value?: number;
	/** Initial value for uncontrolled usage. @default 0 */
	defaultValue?: number;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	/** Clamp typed values into [min, max] as they change — `false` defers clamping to blur. @default true */
	clampOutOfRange?: boolean;
	/** Allow decimal values (sets inputMode="decimal"). @default true */
	allowDecimal?: boolean;
	/** Hide the −/+ buttons, keeping the plain numeric field. @default false */
	hideControls?: boolean;
	/** Content rendered inside the field, left of the value (e.g. "$"). */
	prefix?: JSX.Element;
	/** Content rendered inside the field, right of the value (e.g. "%"). */
	suffix?: JSX.Element;
	/** aria-label for the decrement button. @default "Decrease" */
	decreaseLabel?: string;
	/** aria-label for the increment button. @default "Increase" */
	increaseLabel?: string;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function StepperInput(props: StepperInputProps) {
	const clamp = (n: number) =>
		Math.min(props.max ?? Number.POSITIVE_INFINITY, Math.max(props.min ?? Number.NEGATIVE_INFINITY, n));
	return (
		<NumberInput
			{...props}
			value={props.value}
			defaultValue={props.defaultValue ?? 0}
			step={props.step ?? 1}
			controls={props.hideControls ? "none" : "buttons"}
			clampOutOfRange
			onChange={(v) => {
				if (typeof v !== "number") return;
				props.onChange?.(props.clampOutOfRange === false ? v : clamp(v));
			}}
		/>
	);
}
