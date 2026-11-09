import { presetSolidUI } from "@wrikka/theme/preset";
import {
	defineConfig,
	type Preset,
	presetIcons,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

import { getProductDetail, products } from "./src/data/products";

/* Aliased to source in vite.config.ts — scan the linked source tree. */
const solidUiPackages =
	"D:/opensource/bun-packages/packages/lib/solid-ui/packages/";

export default defineConfig({
	content: {
		filesystem: [
			"./src/**/*.{ts,tsx}",
			`${solidUiPackages}{solid-ui,animation,chart,hooks}/src/**/*.{ts,tsx}`,
		],
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
		/* The linked package resolves its own @unocss/core copy — the preset is plain data, so the cast is safe. */
		presetSolidUI({ mode: "dark", color: "green" }) as unknown as Preset,
		presetIcons({
			collections: {
				mdi: () =>
					import("@iconify-json/mdi/icons.json").then((i) => i.default),
			},
		}),
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	shortcuts: {
		card: "bg-panel border border-edge rounded-xl",
		"input-chip":
			"px-3 py-1.5 rounded-lg text-sm border border-edge bg-raise hover:bg-raise transition-colors",
	},
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
			brand: {
				DEFAULT: "rgb(var(--acc))",
				dim: "rgb(var(--acc))",
			},
			surface: {
				DEFAULT: "rgb(var(--panel))",
				foreground: "hsl(var(--color-surface-foreground))",
				elevated: "hsl(var(--color-surface-elevated))",
				0: "rgb(var(--ink))",
				1: "rgb(var(--panel))",
				2: "rgb(var(--raise))",
				3: "rgb(var(--raise))",
			},
			line: "rgb(var(--edge))",
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
