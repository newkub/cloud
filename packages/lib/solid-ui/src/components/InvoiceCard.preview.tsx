/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { InvoiceCard } from "./InvoiceCard";

export const preview = (): JSX.Element => (
	<InvoiceCard
		class="w-80 max-w-full"
		invoice={{
			id: "INV-2041",
			status: "due",
			issuedAt: "Sep 1, 2026",
			currency: "USD",
			items: [
				{ label: "Pro plan — annual", amount: "$99.00" },
				{ label: "Extra seats", qty: 3, amount: "$45.00" },
				{ label: "Priority support", amount: "$4.00" },
			],
			total: "$148.00",
		}}
		onDownload={() => {}}
	/>
);
