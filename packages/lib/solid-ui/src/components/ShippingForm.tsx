/**
 * ShippingForm — country select, postal code and radio-card shipping method picker (ETA + price).
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface ShippingMethod {
	id: string;
	label: string;
	/** ETA text, e.g. "3–5 business days". */
	eta?: string;
	/** Price — number formatted with `currency`, or pre-formatted string; 0 renders "Free". */
	price: number | string;
}

export interface ShippingFormData {
	country: string;
	zip: string;
	methodId: string;
}

export interface ShippingFormProps extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	methods?: ShippingMethod[];
	/** Selectable countries. @default built-in shortlist */
	countries?: string[];
	/** Called with the collected values on submit. */
	onSubmit?: (data: ShippingFormData) => void;
	/** Currency symbol prepended to numeric prices. @default "$" */
	currency?: string;
	/** Submit button label. @default "Continue to payment" */
	submitLabel?: string;
	/** Initially selected method id — defaults to the first method. */
	defaultMethod?: string;
	/** Corner radius on method cards. */
	radius?: Radius;
}

const defaultCountries = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan"];

const inputCls =
	"h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ShippingForm(props: ShippingFormProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"methods",
		"countries",
		"onSubmit",
		"currency",
		"submitLabel",
		"defaultMethod",
		"radius",
	]);
	const [country, setCountry] = createSignal((local.countries ?? defaultCountries)[0]);
	const [zip, setZip] = createSignal("");
	const [methodId, setMethodId] = createSignal(local.defaultMethod ?? (local.methods ?? [])[0]?.id ?? "");

	const fmt = (p: number | string) =>
		typeof p === "number" ? (p === 0 ? "Free" : `${local.currency ?? "$"}${p.toFixed(2)}`) : p;

	return (
		<form
			class={`solidui-shipping-form flex w-full max-w-sm flex-col gap-4 border p-4 ${surfaceVariants.default} ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			onSubmit={(e) => {
				e.preventDefault();
				local.onSubmit?.({ country: country(), zip: zip(), methodId: methodId() });
			}}
			{...rest}
		>
			<div class="flex flex-col gap-1.5">
				<label for="shipping-country" class="text-xs font-medium text-foreground">
					Country
				</label>
				<select
					id="shipping-country"
					class={inputCls}
					value={country()}
					onChange={(e) => setCountry(e.currentTarget.value)}
				>
					<For each={local.countries ?? defaultCountries}>{(c) => <option value={c}>{c}</option>}</For>
				</select>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="shipping-zip" class="text-xs font-medium text-foreground">
					ZIP / Postal code
				</label>
				<input
					id="shipping-zip"
					type="text"
					required
					autocomplete="postal-code"
					placeholder="90210"
					class={inputCls}
					value={zip()}
					onInput={(e) => setZip(e.currentTarget.value)}
				/>
			</div>
			<fieldset class="flex flex-col gap-2">
				<legend class="mb-1.5 text-xs font-medium text-foreground">Shipping method</legend>
				<For each={local.methods ?? []}>
					{(m) => {
						const checked = () => methodId() === m.id;
						return (
							<label
								class={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${radiusMap[local.radius ?? "lg"]} ${
									checked() ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
								}`}
							>
								<input
									type="radio"
									name="shipping-method"
									value={m.id}
									checked={checked()}
									class="sr-only"
									onChange={() => setMethodId(m.id)}
								/>
								<span
									aria-hidden="true"
									class={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${checked() ? "border-primary" : "border-border"}`}
								>
									<Show when={checked()}>
										<span class="h-2 w-2 rounded-full bg-primary" />
									</Show>
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-medium text-foreground">{m.label}</span>
									<Show when={m.eta}>
										<span class="block text-2xs text-muted-foreground">{m.eta}</span>
									</Show>
								</span>
								<span class="text-sm font-semibold tabular-nums text-foreground">{fmt(m.price)}</span>
							</label>
						);
					}}
				</For>
			</fieldset>
			<button
				type="submit"
				class="flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				{local.submitLabel ?? "Continue to payment"}
			</button>
		</form>
	);
}
