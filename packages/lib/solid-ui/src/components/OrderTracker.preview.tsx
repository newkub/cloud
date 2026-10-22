/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { OrderTracker } from "./OrderTracker";

export const preview = (): JSX.Element => (
	<OrderTracker
		carrier="UPS"
		trackingNumber="1Z999AA10123456784"
		events={[
			{ label: "Order placed", ts: "Sep 12, 10:24 AM", done: true },
			{ label: "Shipped", ts: "Sep 13, 6:02 PM", done: true, note: "Denver, CO" },
			{ label: "Out for delivery", ts: "Sep 15, 8:30 AM", done: true },
			{ label: "Delivered", ts: "Expected by 9:00 PM" },
		]}
	/>
);
