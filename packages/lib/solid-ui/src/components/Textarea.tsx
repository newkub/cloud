/**
 * Textarea — multi-line input with autosize, resize control and error states.
 */
import { createEffect, createSignal, type JSX, onMount, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "min-h-12 px-2.5 py-1.5 text-xs",
	md: "min-h-16 px-3 py-2 text-sm",
	lg: "min-h-20 px-4 py-3 text-base",
};

const resizeMap = {
	none: "resize-none",
	vertical: "resize-y",
	horizontal: "resize-x",
	both: "resize",
} as const;

let textareaId = 0;

export interface TextareaProps
	extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value" | "onInput"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	onInput?: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"];
	/** Corner radius. */
	radius?: Radius;
	/** Grow the field height to fit its content. @default false */
	autosize?: boolean;
	/** Maximum rows the field grows to when `autosize` is on — scrolls beyond that. */
	maxRows?: number;
	/** Minimum rows the field shrinks to when `autosize` is on. */
	minRows?: number;
	/** Which axis the user may resize. @default "vertical" */
	resize?: keyof typeof resizeMap;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
}

export function Textarea(props: TextareaProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"children",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"radius",
		"autosize",
		"maxRows",
		"minRows",
		"resize",
		"error",
		"description",
	]);
	const autoId = `solidui-textarea-${++textareaId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	let ref: HTMLTextAreaElement | undefined;

	const autoResize = () => {
		if (!local.autosize || !ref) return;
		ref.style.height = "auto";
		const lineHeight = Number.parseFloat(getComputedStyle(ref).lineHeight) || 20;
		const minH = local.minRows ? local.minRows * lineHeight : 0;
		const maxH = local.maxRows ? local.maxRows * lineHeight : Number.POSITIVE_INFINITY;
		const next = Math.min(Math.max(ref.scrollHeight, minH), maxH);
		ref.style.height = `${next}px`;
		ref.style.overflowY = ref.scrollHeight > maxH ? "auto" : "hidden";
	};

	onMount(autoResize);
	createEffect(() => {
		value();
		autoResize();
	});

	const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") {
			local.onInput(e);
		}
		autoResize();
	};

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"flex w-full border transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			resizeMap[local.resize ?? "vertical"],
			radiusMap[local.radius ?? "md"],
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const field = (
		<textarea
			id={id()}
			ref={ref}
			class={className()}
			value={value()}
			onInput={handleInput}
			aria-invalid={invalid() || undefined}
			aria-describedby={describedBy()}
			{...rest}
		>
			{local.children}
		</textarea>
	);

	return (
		<Show when={errorText() || local.description} fallback={field}>
			<div class="w-full">
				{field}
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
