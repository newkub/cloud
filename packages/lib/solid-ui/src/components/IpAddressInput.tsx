/**
 * IpAddressInput - IPv4/IPv6 field with per-segment validation and version detection.
 */
import { createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

export type IpVersion = "v4" | "v6" | "auto";

/** True when `value` is a dotted-quad IPv4 address with octets 0-255. */
export function isIpv4(value: string): boolean {
	const parts = value.trim().split(".");
	if (parts.length !== 4) return false;
	return parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255 && String(Number(p)) === p);
}

/** True when `value` is a valid IPv6 address (full, compressed, or mixed). */
export function isIpv6(value: string): boolean {
	const v = value.trim();
	if (!v || v.length > 45) return false;
	const halves = v.split("::");
	if (halves.length > 2) return false;
	const groupOk = (g: string) => /^[0-9a-f]{1,4}$/i.test(g);
	const countGroups = (s: string): number | null => {
		if (s === "") return 0;
		const groups = s.split(":");
		if (groups.some((g) => !groupOk(g))) return null;
		return groups.length;
	};
	const left = countGroups(halves[0]);
	if (left === null) return false;
	if (halves.length === 1) return left === 8;
	const right = countGroups(halves[1]);
	if (right === null) return false;
	return left + right < 8;
}

/** Resolve which version `value` matches for the given mode — null when invalid. */
export function detectIpVersion(value: string, version: IpVersion = "auto"): "v4" | "v6" | null {
	const v = value.trim();
	if (!v) return null;
	if (version === "v4" || (version === "auto" && !v.includes(":"))) return isIpv4(v) ? "v4" : null;
	if (version === "v6" || (version === "auto" && v.includes(":"))) return isIpv6(v) ? "v6" : null;
	return null;
}

export interface IpAddressInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "value" | "size"> {
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	onChange?: (value: string) => void;
	onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
	/** Restrict accepted format. @default "auto" */
	version?: IpVersion;
	variant?: InputVariant;
	size?: ControlSize;
	/** Corner radius. */
	radius?: Radius;
	/** Visible label. */
	label?: JSX.Element;
	/** Helper text rendered below the field. */
	description?: JSX.Element;
	/** Validate on every keystroke (default) or only after blur. @default true */
	validateOnInput?: boolean;
	/** Strip all visual classes — keep behavior only. @default false */
	unstyled?: boolean;
}

export function IpAddressInput(props: IpAddressInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"version",
		"variant",
		"size",
		"radius",
		"label",
		"description",
		"validateOnInput",
		"unstyled",
		"disabled",
		"placeholder",
		"aria-label",
	]);
	const autoId = createUniqueId();
	const id = () => local.id ?? `solidui-ip-input-${autoId}`;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [touched, setTouched] = createSignal(false);
	const value = () => (local.value !== undefined ? local.value : internal());
	const detected = () => detectIpVersion(value(), local.version ?? "auto");
	const invalid = () => touched() && value().trim() !== "" && !detected();
	const versionLabel = () => (local.version === "v4" ? "IPv4" : local.version === "v6" ? "IPv6" : "IPv4 or IPv6");
	const describedBy = () =>
		[invalid() ? `${id()}-error` : "", local.description ? `${id()}-desc` : ""].filter(Boolean).join(" ") || undefined;

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		if (local.validateOnInput ?? true) setTouched(true);
		local.onChange?.(e.currentTarget.value);
		if (typeof local.onInput === "function") local.onInput(e);
	};

	const base =
		"flex w-full border font-mono tabular-nums transition-colors motion-reduce:transition-none placeholder:font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50";
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
		<div class="solidui-ip-address-input w-full">
			<Show when={local.label}>
				<label for={id()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div class="relative">
				<input
					id={id()}
					type="text"
					autocomplete="off"
					spellcheck={false}
					class={className()}
					value={value()}
					disabled={local.disabled}
					placeholder={local.placeholder ?? (local.version === "v6" ? "::1" : "192.168.0.1")}
					aria-label={local["aria-label"]}
					aria-invalid={invalid() || undefined}
					aria-describedby={describedBy()}
					onInput={handleInput}
					onBlur={() => setTouched(true)}
					{...rest}
				/>
				<Show when={detected()}>
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-2xs font-medium uppercase text-success">
						{detected()}
					</span>
				</Show>
			</div>
			<Show when={local.description && !invalid()}>
				<p id={`${id()}-desc`} class="mt-1 text-xs text-muted-foreground">
					{local.description}
				</p>
			</Show>
			<Show when={invalid()}>
				<p id={`${id()}-error`} role="alert" class="mt-1 text-xs text-destructive">
					Enter a valid {versionLabel()} address
				</p>
			</Show>
		</div>
	);
}
