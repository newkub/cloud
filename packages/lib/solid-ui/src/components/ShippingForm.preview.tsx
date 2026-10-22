/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ShippingForm } from "./ShippingForm";

export const preview = (): JSX.Element => (
	<ShippingForm
		methods={[
			{ id: "std", label: "Standard", eta: "3–5 business days", price: 0 },
			{ id: "express", label: "Express", eta: "1–2 business days", price: 12.5 },
		]}
	/>
);
