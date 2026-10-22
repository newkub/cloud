import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		passWithNoTests: true,
		// analytics/ is a scaffolded module, not app code — excluded until wired in
		exclude: [...configDefaults.exclude, "analytics/**"],
	},
});
