import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";

export default defineConfig({
	resolve: {
		dedupe: ["solid-js", "@tanstack/solid-router", "@tanstack/solid-query"],
		alias: [
			{
				find: "#analytics",
				replacement: fileURLToPath(
					new URL("../../packages/services/analytics", import.meta.url),
				),
			},
		],
	},
	server: {
		proxy: {
			"/rpc": {
				target: "http://127.0.0.1:8787",
				changeOrigin: true,
			},
		},
	},
	plugins: [
		tanstackRouter({ target: "solid", autoCodeSplitting: true }),
		unocss(),
		viteSolid(),
	],
});
