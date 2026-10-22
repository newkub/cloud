/**
 * Configuration Provider (Functional style)
 * Handles configuration management with state passing
 */

import type { Result } from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export type ConfigState = Readonly<{
	config: Record<string, unknown>;
}>;

export const createConfigState = (
	initialConfig?: Record<string, unknown>,
): ConfigState => ({
	config: initialConfig || {},
});

const getNestedValue = (
	obj: Record<string, unknown>,
	path: string,
): unknown => {
	return path
		.split(".")
		.reduce<Record<string, unknown> | unknown>((current, key) => {
			return current && typeof current === "object"
				? (current as Record<string, unknown>)[key]
				: undefined;
		}, obj);
};

const setNestedValue = (
	obj: Record<string, unknown>,
	path: string,
	value: unknown,
): Record<string, unknown> => {
	const keys = path.split(".");
	const lastKey = keys.pop();
	if (!lastKey) return obj;
	const result = { ...obj };

	let target: Record<string, unknown> = result;
	for (const key of keys) {
		target[key] = { ...(target[key] as Record<string, unknown>) };
		target = target[key] as Record<string, unknown>;
	}
	target[lastKey] = value;

	return result;
};

export const getConfig = <T>(
	state: ConfigState,
	key: string,
	defaultValue?: T,
): Result<T> => {
	try {
		const value = getNestedValue(state.config, key);
		return ok(value !== undefined ? (value as T) : (defaultValue as T));
	} catch (error) {
		return err(
			error instanceof Error ? error : new Error("Failed to get config"),
		);
	}
};

export const setConfig = (
	state: ConfigState,
	key: string,
	value: unknown,
): Result<ConfigState> => {
	try {
		const newConfig = setNestedValue(state.config, key, value);
		return ok({ config: newConfig });
	} catch (error) {
		return err(
			error instanceof Error ? error : new Error("Failed to set config"),
		);
	}
};

export const getAllConfig = (
	state: ConfigState,
): Result<Record<string, unknown>> => {
	try {
		return ok({ ...state.config });
	} catch (error) {
		return err(
			error instanceof Error ? error : new Error("Failed to get all config"),
		);
	}
};
