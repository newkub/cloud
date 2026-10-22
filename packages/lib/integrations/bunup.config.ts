const config = {
	entry: ["./src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	minify: true,
	target: "node",
	outDir: "./dist",
	packages: "external" as const,
	jsx: { runtime: "automatic" as const, importSource: "solid-js" },
};

export default config;
