/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CartDrawer } from "./CartDrawer";

export const preview = (): JSX.Element => (
	<CartDrawer
		open
		items={[
			{ id: "1", name: "Canvas Tote", price: 29, quantity: 1, meta: "Natural" },
			{ id: "2", name: "Ceramic Mug", price: 18, quantity: 2, meta: "Speckled" },
			{ id: "3", name: "Wool Beanie", price: 24, quantity: 1, meta: "Charcoal" },
		]}
	/>
);
