/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ProductGrid } from "./ProductGrid";

export const preview = (): JSX.Element => (
	<ProductGrid
		class="w-80"
		onAdd={() => {}}
		products={[
			{ id: "1", name: "Canvas Tote", price: 29, rating: 4.5, badge: "New" },
			{ id: "2", name: "Ceramic Mug", price: 18, rating: 4 },
			{ id: "3", name: "Wool Beanie", price: 24, rating: 5 },
			{ id: "4", name: "Linen Scarf", price: 35, rating: 3.5, outOfStock: true },
		]}
	/>
);
