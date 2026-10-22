/**
 * LocalStorageAdapter - Implementation of IStorage port for localStorage
 * Functional style with immutable state and proper error handling
 */

import type { Result } from "../../shared/types";
import { failure, success } from "../../shared/utils";

// IStorage interface defined locally for this adapter
export interface IStorage {
	get<T = unknown>(key: string): Result<T, Error>;
	set(key: string, value: unknown): Result<void, Error>;
	remove(key: string): Result<void, Error>;
	clear(): Result<void, Error>;
}

// Storage error types
export interface StorageError extends Error {
	name: "StorageError";
	operation: string;
	key?: string;
}

export function createStorageError(message: string, operation: string, key?: string): StorageError {
	const error = Object.create(Error.prototype) as StorageError;
	Object.defineProperties(error, {
		name: { value: "StorageError" },
		message: { value: message },
		operation: { value: operation, enumerable: true },
		key: { value: key, enumerable: true },
	});
	return error;
}

// Pure functions for storage operations with Result types
const getItem = <T = unknown>(key: string): Result<T, Error> => {
	try {
		const value = localStorage.getItem(key);
		if (value === null) {
			return failure(createStorageError("Item not found", "get", key));
		}
		const parsed = JSON.parse(value) as T;
		return success(parsed);
	} catch (error) {
		return failure(
			createStorageError(error instanceof Error ? error.message : "Failed to parse storage value", "get", key),
		);
	}
};

const setItem = (key: string, value: unknown): Result<void, Error> => {
	try {
		const serialized = JSON.stringify(value);
		localStorage.setItem(key, serialized);
		return success(undefined);
	} catch (error) {
		return failure(
			createStorageError(error instanceof Error ? error.message : "Failed to set storage value", "set", key),
		);
	}
};

const removeItem = (key: string): Result<void, Error> => {
	try {
		localStorage.removeItem(key);
		return success(undefined);
	} catch (error) {
		return failure(
			createStorageError(error instanceof Error ? error.message : "Failed to remove storage value", "remove", key),
		);
	}
};

const clearAll = (): Result<void, Error> => {
	try {
		localStorage.clear();
		return success(undefined);
	} catch (error) {
		return failure(createStorageError(error instanceof Error ? error.message : "Failed to clear storage", "clear"));
	}
};

// Factory function returning IStorage implementation
export const createLocalStorageAdapter = (): IStorage => ({
	get: getItem,
	set: setItem,
	remove: removeItem,
	clear: clearAll,
});
