/**
 * EditableText — click-to-edit inline text built on contentEditable.
 * Enter commits, Escape cancels (with `onCancel`), blur commits unless
 * `submitOnBlur={false}`.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { controlSizes, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface EditableTextProps
	extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "onCancel"> {
	/** Controlled text. */
	value?: string;
	/** Initial text (uncontrolled). */
	defaultValue?: string;
	/** Called on every keystroke while editing. */
	onChange?: (value: string) => void;
	/** Called once when the edit is committed (Enter or blur). */
	onSubmit?: (value: string) => void;
	/** Called when editing is cancelled via Escape. */
	onCancel?: (value: string) => void;
	/** Placeholder shown while empty (aria-placeholder + data-placeholder). */
	placeholder?: string;
	/** Allow multi-line editing — Enter inserts a newline instead of committing. */
	multiline?: boolean;
	/** What starts editing. @default "click" */
	editOn?: "click" | "dblclick" | "focus";
	/** Commit on blur. @default true */
	submitOnBlur?: boolean;
	/** Block editing entirely. */
	disabled?: boolean;
	/** Text is selectable/focusable but never editable. */
	readOnly?: boolean;
	variant?: "default" | "outline" | "filled" | "ghost";
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

export function EditableText(props: EditableTextProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"value",
		"defaultValue",
		"onChange",
		"onSubmit",
		"onCancel",
		"placeholder",
		"multiline",
		"editOn",
		"submitOnBlur",
		"disabled",
		"readOnly",
		"variant",
		"size",
		"onKeyDown",
		"onBlur",
		"onInput",
		"onClick",
		"onDblClick",
		"onFocus",
		"radius",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [editing, setEditing] = createSignal(false);
	let ref: HTMLDivElement | undefined;
	let cancelling = false;

	const value = () => (local.value !== undefined ? local.value : internal());
	const commit = () => {
		const text = ref?.innerText ?? "";
		setInternal(text);
		local.onChange?.(text);
		local.onSubmit?.(text);
	};

	/** Focus the element and place the caret at the end. */
	const focusEditable = () => {
		queueMicrotask(() => {
			if (!ref) return;
			ref.focus();
			try {
				const range = document.createRange();
				range.selectNodeContents(ref);
				range.collapse(false);
				const sel = getSelection();
				sel?.removeAllRanges();
				sel?.addRange(range);
			} catch {
				/* jsdom */
			}
		});
	};

	const beginEdit = () => {
		if (local.disabled || local.readOnly || editing()) return;
		setEditing(true);
		focusEditable();
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (e.defaultPrevented) return;
		if (e.key === "Enter" && !local.multiline) {
			e.preventDefault();
			commit();
			setEditing(false);
			ref?.blur();
		} else if (e.key === "Escape") {
			e.preventDefault();
			cancelling = true;
			const prev = value();
			if (ref) ref.innerText = prev;
			if (editing()) local.onCancel?.(prev);
			setEditing(false);
			ref?.blur();
		}
	};

	const onInput = (e: InputEvent) => {
		local.onChange?.(ref?.innerText ?? "");
		if (typeof local.onInput === "function") {
			(local.onInput as (e: InputEvent) => void)(e);
		}
	};

	const onBlur = (e: FocusEvent) => {
		if (cancelling) {
			cancelling = false;
		} else if (editing() && (local.submitOnBlur ?? true)) {
			commit();
		}
		setEditing(false);
		if (typeof local.onBlur === "function") {
			(local.onBlur as (e: FocusEvent) => void)(e);
		}
	};

	const onClick = (e: MouseEvent) => {
		if ((local.editOn ?? "click") === "click") beginEdit();
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};
	const onDblClick = (e: MouseEvent) => {
		if (local.editOn === "dblclick") beginEdit();
		if (typeof local.onDblClick === "function") {
			(local.onDblClick as (e: MouseEvent) => void)(e);
		}
	};
	const onFocus = (e: FocusEvent) => {
		if (local.editOn === "focus") beginEdit();
		if (typeof local.onFocus === "function") {
			(local.onFocus as (e: FocusEvent) => void)(e);
		}
	};

	const base =
		"w-full border transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
	const className = () =>
		[
			base,
			editing() ? inputVariants[local.variant ?? "default"] : "border-transparent bg-transparent",
			!editing() && !local.disabled && !local.readOnly ? "cursor-text hover:bg-muted/50" : "",
			controlSizes[local.size ?? "md"],
			local.multiline ? "min-h-[60px]" : "overflow-hidden whitespace-nowrap",
			radiusMap[local.radius ?? "md"],
			local.disabled ? "cursor-not-allowed opacity-50" : "",
			local.readOnly ? "cursor-default" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: contentEditable textbox supports rich content, unlike input/textarea
		<div
			ref={ref}
			contentEditable={editing() && !local.disabled && !local.readOnly}
			role="textbox"
			aria-multiline={local.multiline}
			aria-placeholder={local.placeholder}
			aria-readonly={local.readOnly || undefined}
			aria-disabled={local.disabled || undefined}
			data-placeholder={local.placeholder}
			data-editing={editing() || undefined}
			tabIndex={local.disabled ? -1 : 0}
			class={className()}
			onClick={onClick}
			onDblClick={onDblClick}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			onInput={onInput}
			{...rest}
		>
			{local.children ?? value()}
		</div>
	);
}
