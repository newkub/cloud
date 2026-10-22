/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ProductCard } from "./ProductCard";

export const preview = (): JSX.Element => (
	<ProductCard name="Canvas Tote" price={29} currency="$" rating={4.5} class="w-56" />
);
