/**
 * UsernameInput - username field with format validation and debounced availability check.
 */
import { createSignal, createUniqueId, type JSX, onCleanup, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";
import { Spinner } from "./Spinner";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

export type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken";

export interface UsernameInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "value" | "size" | "pattern"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	/** Async availability lookup — resolve `true` when the name is free. */
	checkAvailable?: (value: string) => Promise<boolean>;
	/** Debounce delay before `checkAvailable` runs. @default 300 */
	debounceMs?: number;
	/** Minimum allowed length. @default 3 */
	minLength?: number;
	/** Allowed characters. @default /^[a-zA-Z0-9_]+$/ */
	pattern?: RegExp;
	/** Message shown when `pattern` fails. @default "Only letters, numbers, and underscores" */
	patternMessage?: string;
	variant?: InputVariant;
	size?: ControlSize;
	/** Corner radius. */
	radius?: Radius;
	/** Visible label — omit for aria-label only usage. */
	label?: JSX.Element;
	/** Helper text rendered below the field when no status message is shown. */
	description?: JSX.Element;
	/** Strip all visual classes — keep behavior only. @default false */
	unstyled?: boolean;
}

export function UsernameInput(props: UsernameInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"checkAvailable",
		"debounceMs",
		"minLength",
		"pattern",
		"patternMessage",
		"variant",
		"size",
		"radius",
		"label",
		"description",
		"unstyled",
		"disabled",
		"placeholder",
		"aria-label",
	]);
	const autoId = createUniqueId();
	const id = () => local.id ?? `solidui-username-input-${autoId}`;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	const [status, setStatus] = createSignal<UsernameStatus>("idle");
	const [hint, setHint] = createSignal("");
	let timer: ReturnType<typeof setTimeout> | undefined;
	let requestId = 0;
	onCleanup(() => clearTimeout(timer));

	const minLength = () => local.minLength ?? 3;
	const charset = () => local.pattern ?? /^[a-zA-Z0-9_]+$/;

	const validate = (v: string): UsernameStatus => {
		if (!v) return "idle";
		if (v.length < minLength()) {
			setHint(`Must be at least ${minLength()} characters`);
			return "invalid";
		}
		if (!charset().test(v)) {
			setHint(local.patternMessage ?? "Only letters, numbers, and underscores");
			return "invalid";
		}
		return "idle";
	};

	const schedule = (v: string) => {
		clearTimeout(timer);
		requestId += 1;
		const myId = requestId;
		if (!v || !local.checkAvailable) {
			setStatus(validate(v));
			if (validate(v) === "idle") setHint("");
			return;
		}
		const format = validate(v);
		if (format === "invalid") {
			setStatus("invalid");
			return;
		}
		setStatus("checking");
		setHint("");
		timer = setTimeout(() => {
			local.checkAvailable?.(v).then(
				(ok) => {
					if (myId !== requestId) return;
					setStatus(ok ? "available" : "taken");
					setHint(ok ? "Username is available" : "Username is taken");
				},
				() => {
					if (myId !== requestId) return;
					setStatus("idle");
					setHint("Could not check availability");
				},
			);
		}, local.debounceMs ?? 300);
	};

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") local.onInput(e);
		schedule(e.currentTarget.value);
	};

	const invalid = () => status() === "invalid" || status() === "taken";
	const messageId = () => `${id()}-status`;
	const describedBy = () =>
		[hint() ? messageId() : "", local.description ? `${id()}-desc` : ""].filter(Boolean).join(" ") || undefined;

	const base =
		"flex w-full border transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					base,
					inputVariants[local.variant ?? "default"],
					sizeMap[local.size ?? "md"],
					radiusMap[local.radius ?? "md"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	const statusCls = () =>
		status() === "available"
			? "text-success"
			: status() === "invalid" || status() === "taken"
				? "text-destructive"
				: "text-muted-foreground";

	return (
		<div class="solidui-username-input w-full">
			<Show when={local.label}>
				<label for={id()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div class="relative">
				<input
					id={id()}
					type="text"
					autocomplete="username"
					spellcheck={false}
					class={className()}
					value={value()}
					disabled={local.disabled}
					placeholder={local.placeholder}
					aria-label={local["aria-label"]}
					aria-invalid={invalid() || undefined}
					aria-describedby={describedBy()}
					onInput={handleInput}
					{...rest}
				/>
				<Show when={status() === "checking"}>
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
						<Spinner size="sm" variant="muted" />
					</span>
				</Show>
			</div>
			<Show when={local.description && !hint()}>
				<p id={`${id()}-desc`} class="mt-1 text-xs text-muted-foreground">
					{local.description}
				</p>
			</Show>
			<Show when={hint() || status() === "checking"}>
				<p
					id={messageId()}
					role={status() === "invalid" || status() === "taken" ? "alert" : "status"}
					class={`mt-1 flex items-center gap-1.5 text-xs ${statusCls()}`}
				>
					{status() === "checking" ? "Checking availability…" : hint()}
				</p>
			</Show>
		</div>
	);
}
