/**
 * SearchInput — search field with icon, clear button, loading and error states.
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

let searchInputId = 0;

function SearchIcon() {
	return (
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<circle cx="11" cy="11" r="7" />
			<path d="m21 21-4.3-4.3" stroke-linecap="round" />
		</svg>
	);
}

export interface SearchInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "type" | "value" | "size"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	/** Called when the user presses Enter or the native search action fires. */
	onSearch?: (value: string) => void;
	onClear?: () => void;
	clearLabel?: string;
	/** Show the × clear button while the field has a value. @default true */
	clearable?: boolean;
	/** Show a spinner inside the right edge — e.g. while results load. @default false */
	loading?: boolean;
	/** Content rendered inside the left edge — defaults to a magnifier icon. Pass `null` to hide. */
	leftSection?: JSX.Element;
	/** Content rendered inside the right edge. */
	rightSection?: JSX.Element;
	/** Error state — `true` marks the field invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}

export function SearchInput(props: SearchInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"onSearch",
		"onClear",
		"clearLabel",
		"clearable",
		"loading",
		"leftSection",
		"rightSection",
		"error",
		"description",
		"radius",
		"disabled",
		"readOnly",
		"onKeyDown",
	]);
	const autoId = `solidui-search-${++searchInputId}`;
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

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		if (e.key === "Enter") local.onSearch?.(e.currentTarget.value);
		if (typeof local.onKeyDown === "function") {
			local.onKeyDown(e);
		}
	};

	const left = () => (local.leftSection === null ? undefined : (local.leftSection ?? <SearchIcon />));
	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const showClear = () => (local.clearable ?? true) && value() !== "" && !local.disabled && !local.readOnly;
	const rightCount = () => (local.rightSection ? 1 : 0) + (showClear() ? 1 : 0) + (local.loading ? 1 : 0);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"flex w-full border transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:appearance-none";
	const className = () =>
		[
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

	return (
		<div class="w-full">
			<div class="relative">
				<Show when={left()}>
					<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground [&>*]:pointer-events-auto">
						{left()}
					</span>
				</Show>
				<input
					id={id()}
					ref={inputRef}
					type="search"
					class={className()}
					value={value()}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					aria-invalid={invalid() || undefined}
					aria-describedby={describedBy()}
					disabled={local.disabled}
					readOnly={local.readOnly}
					{...rest}
				/>
				<Show when={rightCount() > 0}>
					<span class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2.5 text-muted-foreground">
						<Show when={local.loading}>
							<Spinner size="sm" variant="muted" />
						</Show>
						<Show when={showClear()}>
							<button
								type="button"
								class="rounded p-0.5 transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								onClick={handleClear}
								aria-label={local.clearLabel ?? "Clear search"}
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
	);
}
