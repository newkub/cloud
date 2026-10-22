/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CreditCardInput } from "./CreditCardInput";

export const preview = (): JSX.Element => (
	<CreditCardInput
		class="w-72 max-w-full"
		defaultValue={{ number: "4242 4242 4242 4242", expiry: "12/28", cvc: "123" }}
	/>
);
