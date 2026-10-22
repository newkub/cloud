/**
 * PhoneInput — country/dial-code select + phone number input emitting a combined value.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

/** A selectable country/region dialing entry. */
export interface PhoneCountry {
	/** Dial code e.g. "+66". */
	dial: string;
	/** Display name e.g. "Thailand". */
	label: string;
	/** Optional flag/iso text shown before the label. */
	flag?: string;
}

export const PHONE_DEFAULT_COUNTRIES: PhoneCountry[] = [
	{ dial: "+1", label: "US/CA", flag: "🇺🇸" },
	{ dial: "+44", label: "UK", flag: "🇬🇧" },
	{ dial: "+66", label: "TH", flag: "🇹🇭" },
	{ dial: "+81", label: "JP", flag: "🇯🇵" },
	{ dial: "+86", label: "CN", flag: "🇨🇳" },
];

/** Apply a `#`-digit mask e.g. "### ### ####" → "081 234 5678". */
export function formatPhoneMask(digits: string, mask: string): string {
	const d = digits.replace(/\D/g, "");
	let out = "";
	let i = 0;
	for (const ch of mask) {
		if (i >= d.length) break;
		if (ch === "#") {
			out += d[i];
			i++;
		} else {
			out += ch;
		}
	}
	// Digits beyond the mask are appended verbatim.
	return out + d.slice(i);
}

export interface PhoneInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled full value e.g. "+66 812345678" */
	value?: string;
	defaultValue?: string;
	/** Available dial codes @default ["+1","+44","+66","+81","+86"] — prefer `countries` for labels. */
	codes?: string[];
	/** Rich country entries — takes precedence over `codes`. */
	countries?: PhoneCountry[];
	/** Display mask for the national number — `#` is a digit, e.g. "### ### ####". */
	mask?: string;
	/** Show a clear button when a number is present. @default false */
	clearable?: boolean;
	/** Error message or invalid flag. */
	error?: boolean | string;
	/** Prevent editing while keeping the value visible. @default false */
	readOnly?: boolean;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** `name`/`id`/`placeholder` applied to the inner tel input. */
	name?: string;
	id?: string;
	placeholder?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	/** Called when the dial code changes. */
	onCountryChange?: (dial: string) => void;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = { sm: "h-8 text-xs", md: "h-9 text-sm", lg: "h-10 text-sm" } as const;

export function PhoneInput(props: PhoneInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"codes",
		"countries",
		"mask",
		"clearable",
		"error",
		"readOnly",
		"fullWidth",
		"name",
		"id",
		"placeholder",
		"variant",
		"size",
		"onChange",
		"onCountryChange",
		"disabled",
		"radius",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => local.value ?? internal();
	const dials = () => local.countries?.map((c) => c.dial) ?? local.codes ?? PHONE_DEFAULT_COUNTRIES.map((c) => c.dial);
	const code = () => dials().find((c) => value().startsWith(c)) ?? dials()[0] ?? "+1";
	const rawNumber = () => value().replace(code(), "").trim();
	const number = () => (local.mask ? formatPhoneMask(rawNumber(), local.mask) : rawNumber());
	const invalid = () => Boolean(local.error);
	const commit = (c: string, n: string) => {
		const digits = n.replace(/\D/g, "");
		const next = digits ? `${c} ${digits}` : "";
		setInternal(next);
		local.onChange?.(next);
	};
	const cls = () => sizeClass[local.size ?? "md"];
	return (
		<div class={`solidui-phone-input ${local.fullWidth ? "w-full" : "inline-block"}`.trim()}>
			<div
				class={`inline-flex w-full items-center overflow-hidden border focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${
					invalid() ? "border-destructive" : ""
				} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<select
					disabled={local.disabled || local.readOnly}
					class={`border-r border-input bg-muted/50 px-2 ${cls()} text-muted-foreground focus-visible:outline-none disabled:opacity-50`}
					value={code()}
					onChange={(e) => {
						commit(e.currentTarget.value, rawNumber());
						local.onCountryChange?.(e.currentTarget.value);
					}}
					aria-label="Country code"
				>
					<Show
						when={local.countries}
						fallback={
							<For each={local.codes ?? PHONE_DEFAULT_COUNTRIES.map((c) => c.dial)}>
								{(c) => <option value={c}>{c}</option>}
							</For>
						}
					>
						<For each={local.countries}>
							{(c) => (
								<option value={c.dial}>
									{c.flag ? `${c.flag} ` : ""}
									{c.label} {c.dial}
								</option>
							)}
						</For>
					</Show>
				</select>
				<input
					type="tel"
					disabled={local.disabled}
					readOnly={local.readOnly}
					name={local.name}
					id={local.id}
					placeholder={local.placeholder ?? "Phone number"}
					aria-invalid={invalid() || undefined}
					class={`w-full min-w-0 border-0 bg-transparent px-3 ${cls()} text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50`}
					value={number()}
					onInput={(e) => commit(code(), e.currentTarget.value)}
				/>
				<Show when={(local.clearable ?? false) && rawNumber()}>
					<button
						type="button"
						disabled={local.disabled}
						aria-label="Clear phone number"
						class={`mr-1 flex items-center justify-center rounded px-1.5 text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${cls()}`}
						onClick={() => commit(code(), "")}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
						</svg>
					</button>
				</Show>
			</div>
			<Show when={typeof local.error === "string"}>
				<span class="mt-1 block text-xs text-destructive" role="alert">
					{local.error}
				</span>
			</Show>
		</div>
	);
}
