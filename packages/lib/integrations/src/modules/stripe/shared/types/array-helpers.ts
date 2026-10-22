// ============================================================================
// Shared Kernel - Array Utilities
// ============================================================================

import { fromNullable } from "./option-helpers";
import type { Option } from "./result-either";

export const map =
	<T, U>(fn: (x: T) => U) =>
	(array: readonly T[]): readonly U[] =>
		array.map(fn);

export const filter =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): readonly T[] =>
		array.filter(predicate);

export const reduce =
	<T, U>(fn: (acc: U, x: T) => U, initial: U) =>
	(array: readonly T[]): U =>
		array.reduce(fn, initial);

export const find =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): Option<T> => {
		const found = array.find(predicate);
		return fromNullable(found);
	};

export const findIndex =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): number =>
		array.findIndex(predicate);

export const includes =
	<T>(value: T) =>
	(array: readonly T[]): boolean =>
		array.includes(value);

export const isEmpty = <T>(array: readonly T[]): boolean => array.length === 0;

export const head = <T>(array: readonly T[]): Option<T> =>
	fromNullable(array[0]);

export const tail = <T>(array: readonly T[]): readonly T[] => array.slice(1);

export const length = <T>(array: readonly T[]): number => array.length;
