import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../../lib/variants";

export interface NumberInputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "onInput" | "type" | "value" | "size" | "min" | "max" | "step" | "prefix"
	> {
	/** Controlled value — `""` while the field is cleared. */
	value?: number | string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: number;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: number | string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	min?: number;
	max?: number;
	step?: number;
	/** Clamp the value into [min, max] when the field loses focus. @default true */
	clampOutOfRange?: boolean;
	/** Content rendered inside the left edge (e.g. "$"). */
	prefix?: JSX.Element;
	/** Content rendered inside the right edge (e.g. "kg"). */
	suffix?: JSX.Element;
	/** Allow decimal input — `false` strips the decimal separator. @default true */
	allowDecimal?: boolean;
	/** Hide the native spin buttons. @default false */
	hideControls?: boolean;
	/** Control style — "buttons" renders −/+ step buttons (StepperInput layout). @default "native" */
	controls?: "native" | "buttons" | "none";
	/** aria-label for the decrement button (controls="buttons"). @default "Decrease" */
	decreaseLabel?: string;
	/** aria-label for the increment button (controls="buttons"). @default "Increase" */
	increaseLabel?: string;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}
