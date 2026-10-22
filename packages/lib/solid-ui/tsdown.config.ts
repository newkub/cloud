import { defineConfig } from "tsdown";

export default defineConfig({
	entry: [
		"./src/index.ts",
		"./src/registry.ts",
		"./src/modules/command-palette/index.ts",
		"./src/preset.ts",
		"./src/theme/index.ts",
	],
	format: ["esm"],
	dts: true,
	clean: true,
	treeshake: true,
	minify: false,
});
