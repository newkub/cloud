import { describe, expect, it } from "vitest";
import { createEvent, isSessionActive, mergeConfig } from "./modules/analytics";

describe("cloud analytics public API", () => {
	it("exports core domain utility functions", () => {
		expect(createEvent).toBeTypeOf("function");
		expect(isSessionActive).toBeTypeOf("function");
		expect(mergeConfig).toBeTypeOf("function");
	});

	it("merges default and partial config", () => {
		const config = mergeConfig({ debug: true });
		expect(config.debug).toBe(true);
	});
});
