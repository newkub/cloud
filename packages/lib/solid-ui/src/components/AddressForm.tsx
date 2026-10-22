/**
 * AddressForm — street/city/zip/country grid fields with inline required markers.
 */
import { createSignal, createUniqueId, For, type JSX, splitProps } from "solid-js";

export interface AddressValue {
	street: string;
	city: string;
	zip: string;
	country: string;
}

const EMPTY: AddressValue = { street: "", city: "", zip: "", country: "" };

const FIELDS: { key: keyof AddressValue; label: string; required: boolean; autoComplete: string; span: boolean }[] = [
	{ key: "street", label: "Street address", required: true, autoComplete: "street-address", span: true },
	{ key: "city", label: "City", required: true, autoComplete: "address-level2", span: false },
	{ key: "zip", label: "ZIP / Postal code", required: true, autoComplete: "postal-code", span: false },
	{ key: "country", label: "Country", required: true, autoComplete: "country-name", span: true },
];

export interface AddressFormProps extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onChange" | "onInput"> {
	/** Controlled address value. */
	value?: AddressValue;
	/** Initial value for uncontrolled usage. */
	defaultValue?: AddressValue;
	/** Called with the next address on any field edit. */
	onChange?: (value: AddressValue) => void;
	/** Single-column layout with tighter spacing. @default false */
	compact?: boolean;
}

export function AddressForm(props: AddressFormProps) {
	const [local, rest] = splitProps(props, ["class", "value", "defaultValue", "onChange", "compact"]);
	const id = `solidui-address-form-${createUniqueId()}`;
	const [internal, setInternal] = createSignal<AddressValue>(local.defaultValue ?? { ...EMPTY });
	const value = () => local.value ?? internal();

	const update = (key: keyof AddressValue, next: string) => {
		const merged = { ...value(), [key]: next };
		if (local.value === undefined) setInternal(merged);
		local.onChange?.(merged);
	};

	return (
		<form
			class={`solidui-address-form ${local.compact ? "flex flex-col gap-3" : "grid grid-cols-2 gap-3"} ${local.class ?? ""}`}
			onSubmit={(e) => e.preventDefault()}
			{...rest}
		>
			<For each={FIELDS}>
				{(field) => (
					<div class={`flex flex-col gap-1 ${!local.compact && field.span ? "col-span-2" : ""}`}>
						<label for={`${id}-${field.key}`} class="text-sm font-medium text-foreground">
							{field.label}
							{field.required ? (
								<span class="ml-0.5 text-destructive" aria-hidden="true">
									*
								</span>
							) : null}
						</label>
						<input
							id={`${id}-${field.key}`}
							type="text"
							class="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							value={value()[field.key]}
							required={field.required}
							autocomplete={field.autoComplete}
							onInput={(e) => update(field.key, e.currentTarget.value)}
						/>
					</div>
				)}
			</For>
		</form>
	);
}
