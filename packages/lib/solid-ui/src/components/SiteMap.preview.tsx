/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SiteMap } from "./SiteMap";

export const preview = (): JSX.Element => (
	<SiteMap
		nodes={[
			{
				label: "Products",
				href: "/products",
				children: [
					{ label: "Overview", href: "/products/overview" },
					{ label: "Pricing", href: "/products/pricing" },
				],
			},
			{
				label: "Company",
				children: [{ label: "About", href: "/about" }],
			},
			{ label: "Contact", href: "/contact" },
		]}
	/>
);
