/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AddressForm } from "./AddressForm";

export const preview = (): JSX.Element => (
	<AddressForm
		class="w-80 max-w-full"
		defaultValue={{ street: "221B Baker St", city: "London", zip: "NW1 6XE", country: "United Kingdom" }}
	/>
);
