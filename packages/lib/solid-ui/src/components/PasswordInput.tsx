/**
 * PasswordInput — password field with visibility toggle, sections, loading and error states.
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

let passwordInputId = 0;

export interface PasswordInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "type" | "value" | "size"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	/** Show the visibility toggle button. @default true */
	showToggle?: boolean;
	/** aria-label for the toggle while the password is hidden. @default "Show password" */
	showLabel?: string;
	/** aria-label for the toggle while the password is visible. @default "Hide password" */
	hideLabel?: string;
	/** Content rendered inside the left edge of the field (e.g. a lock icon). */
	leftSection?: JSX.Element;
	/** Show a spinner inside the right edge — e.g. while validating. @default false */
	loading?: boolean;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}

export function PasswordInput(props: PasswordInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"showToggle",
		"showLabel",
		"hideLabel",
		"leftSection",
		"loading",
		"error",
		"description",
		"radius",
		"disabled",
	]);
	const autoId = `solidui-password-${++passwordInputId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [show, setShow] = createSignal(false);
	const value = () => (local.value !== undefined ? local.value : internal());

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") {
			local.onInput(e);
		}
	};

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"flex w-full border pr-10 transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			local.leftSection ? padLeft[local.size ?? "md"] : "",
			local.loading ? "pr-16" : "",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class="w-full">
			<div class="relative">
				<Show when={local.leftSection}>
					<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground [&>*]:pointer-events-auto">
						{local.leftSection}
					</span>
				</Show>
				<input
					id={id()}
					type={show() ? "text" : "password"}
					class={className()}
					value={value()}
					onInput={handleInput}
					aria-invalid={invalid() || undefined}
					aria-describedby={describedBy()}
					disabled={local.disabled}
					{...rest}
				/>
				<span class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2.5 text-muted-foreground">
					<Show when={local.loading}>
						<Spinner size="sm" variant="muted" />
					</Show>
					{local.showToggle !== false && (
						<button
							type="button"
							class="rounded px-2 py-1 text-xs font-medium transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={() => setShow((v) => !v)}
							aria-pressed={show()}
							aria-label={show() ? (local.hideLabel ?? "Hide password") : (local.showLabel ?? "Show password")}
						>
							{show() ? "Hide" : "Show"}
						</button>
					)}
				</span>
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
	);
}
