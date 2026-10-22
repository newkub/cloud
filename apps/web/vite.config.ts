import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
	resolve: {
		alias: {
			"#analytics": fileURLToPath(
				new URL("../../packages/services/analytics", import.meta.url),
			),
		},
	},
	plugins: [
		tanstackRouter({ target: "solid", autoCodeSplitting: true }),
		unocss(),
		viteSolid(),
	],
});
