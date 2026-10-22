import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

import { getProductDetail, products } from "./src/data/products";

export default defineConfig({
	content: {
		filesystem: ["./src/**/*.{ts,tsx}"],
	},
	safelist: products.flatMap((p) => {
		const detail = getProductDetail(p);
		return [
			p.icon,
			...detail.actions.map((a) => a.icon),
			...detail.activity.map((a) => a.icon),
		];
	}),
	presets: [
		presetWind4(),
		presetIcons({
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
		}),
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	theme: {
		colors: {
			/* CSS vars as rgb() — wind4 applies opacity via color-mix */
			ink: "rgb(var(--ink))",
			panel: "rgb(var(--panel))",
			raise: "rgb(var(--raise))",
			edge: "rgb(var(--edge))",
			fg: "rgb(var(--fg))",
			dim: "rgb(var(--dim))",
			faint: "rgb(var(--faint))",
			ok: "rgb(var(--ok))",
			err: "rgb(var(--err))",
			acc: "rgb(var(--acc))",
		},
		animation: {
			keyframes: {
				"pulse-dot":
					"{0%,100%{box-shadow:0 0 0 0 rgb(var(--acc)/.5)}50%{box-shadow:0 0 0 4px rgb(var(--acc)/0)}}",
				"page-in":
					"{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}",
			},
			durations: {
				"pulse-dot": "2s",
				"page-in": ".3s",
			},
			timingFns: {
				"pulse-dot": "ease-out",
				"page-in": "ease",
			},
			counts: {
				"pulse-dot": "infinite",
				"page-in": "1",
			},
		},
	},
});
