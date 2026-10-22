/** Text-input event handlers for `DatePicker` — draft editing, commit, and open toggles. */
import type { JSX } from "solid-js";
import type { DatePickerProps } from "./types";

export interface DatePickerInputState {
	/** Formatted value shown when not editing. */
	display: () => string;
	/** Raw text while the user is typing (null when not editing). */
	setDraft: (v: string | null) => void;
	/** Parse + commit the current draft into the value signal. */
	commitDraft: () => void;
	open: () => boolean;
	setOpen: (v: boolean) => void;
}

type HandlerProps = Pick<DatePickerProps, "readOnly" | "onInput" | "onFocus" | "onBlur" | "onKeyDown" | "onClick">;

export function createDatePickerInputHandlers(local: HandlerProps, state: DatePickerInputState) {
	const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
		state.setDraft(e.currentTarget.value);
		if (typeof local.onInput === "function") (local.onInput as (e: InputEvent) => void)(e);
	};
	const onFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		state.setDraft(state.display());
		if (typeof local.onFocus === "function") (local.onFocus as (e: FocusEvent) => void)(e);
	};
	const onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
		state.commitDraft();
		if (typeof local.onBlur === "function") (local.onBlur as (e: FocusEvent) => void)(e);
	};
	const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		if (typeof local.onKeyDown === "function") (local.onKeyDown as (e: KeyboardEvent) => void)(e);
		if (e.defaultPrevented) return;
		if (e.key === "Enter") state.commitDraft();
		else if (e.key === "Escape" && state.open()) {
			e.stopPropagation();
			state.setOpen(false);
		} else if (e.key === "ArrowDown" && !state.open()) state.setOpen(true);
	};
	const onClick: JSX.EventHandler<HTMLInputElement, MouseEvent> = (e) => {
		if (!local.readOnly) state.setOpen(true);
		if (typeof local.onClick === "function") (local.onClick as (e: MouseEvent) => void)(e);
	};

	return { onInput, onFocus, onBlur, onKeyDown, onClick };
}
