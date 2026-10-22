/**
 * DomainInput - domain name field with validation and subdomain/domain/TLD split chips.
 */
import { createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
const TLD_RE = /^[a-z]{2,63}$/i;

export interface DomainParts {
	/** Everything left of the registrable domain — "" when absent. */
	subdomain: string;
	/** Registrable (second-level) domain label. */
	domain: string;
	/** Top-level domain. */
	tld: string;
}

/** Parse a hostname into subdomain/domain/TLD — returns null when invalid. */
export function parseDomain(value: string): DomainParts | null {
	const v = value.trim().toLowerCase().replace(/\.$/, "");
	if (!v || v.length > 253 || v.includes("..")) return null;
	const labels = v.split(".");
	if (labels.length < 2) return null;
	const tld = labels[labels.length - 1];
	if (!TLD_RE.test(tld)) return null;
	for (const label of labels.slice(0, -1)) {
		if (!LABEL_RE.test(label)) return null;
	}
	return {
		subdomain: labels.slice(0, -2).join("."),
		domain: labels[labels.length - 2],
		tld,
	};
}

export interface DomainInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "value" | "size"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	variant?: InputVariant;
	size?: ControlSize;
	/** Corner radius. */
	radius?: Radius;
	/** Visible label. */
	label?: JSX.Element;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Show the subdomain/domain/TLD chips when the value parses. @default true */
	showParts?: boolean;
	/** Strip all visual classes — keep behavior only. @default false */
	unstyled?: boolean;
}

const chipCls = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium";

export function DomainInput(props: DomainInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"variant",
		"size",
		"radius",
		"label",
		"description",
		"showParts",
		"unstyled",
		"disabled",
		"placeholder",
		"aria-label",
	]);
	const autoId = createUniqueId();
	const id = () => local.id ?? `solidui-domain-input-${autoId}`;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [touched, setTouched] = createSignal(false);
	const value = () => (local.value !== undefined ? local.value : internal());
	const parts = () => parseDomain(value());
	const invalid = () => touched() && value().trim() !== "" && !parts();
	const describedBy = () =>
		[invalid() ? `${id()}-error` : "", local.description ? `${id()}-desc` : ""].filter(Boolean).join(" ") || undefined;

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		setTouched(true);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") local.onInput(e);
	};

	const base =
		"flex w-full border font-mono transition-colors motion-reduce:transition-none placeholder:font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
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

	return (
		<div class="solidui-domain-input w-full">
			<Show when={local.label}>
				<label for={id()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<input
				id={id()}
				type="text"
				inputmode="url"
				autocomplete="off"
				spellcheck={false}
				class={className()}
				value={value()}
				disabled={local.disabled}
				placeholder={local.placeholder ?? "example.com"}
				aria-label={local["aria-label"]}
				aria-invalid={invalid() || undefined}
				aria-describedby={describedBy()}
				onInput={handleInput}
				{...rest}
			/>
			<Show when={local.description && !invalid()}>
				<p id={`${id()}-desc`} class="mt-1 text-xs text-muted-foreground">
					{local.description}
				</p>
			</Show>
			<Show when={invalid()}>
				<p id={`${id()}-error`} role="alert" class="mt-1 text-xs text-destructive">
					Enter a valid domain, e.g. app.example.com
				</p>
			</Show>
			<Show when={(local.showParts ?? true) && parts()}>
				{(p) => (
					// biome-ignore lint/a11y/useSemanticElements: labelled chip group, not a form fieldset
					<div class="mt-1.5 flex flex-wrap items-center gap-1" role="group" aria-label="Domain parts">
						<Show when={p().subdomain}>
							<span class={`${chipCls} border-border bg-muted text-muted-foreground`}>
								<span class="opacity-70">sub</span>
								{p().subdomain}
							</span>
						</Show>
						<span class={`${chipCls} border-primary/30 bg-primary/10 text-primary`}>
							<span class="opacity-70">domain</span>
							{p().domain}
						</span>
						<span class={`${chipCls} border-border bg-muted text-muted-foreground`}>
							<span class="opacity-70">tld</span>.{p().tld}
						</span>
					</div>
				)}
			</Show>
		</div>
	);
}
