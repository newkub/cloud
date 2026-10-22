/**
 * Pure utility functions used across the animation library
 */

export const identity = <T>(x: T): T => x;

export const pipe =
	<A>(value: A) =>
	<B>(fn: (a: A) => B): B =>
		fn(value);

export const compose =
	<B, C>(f2: (b: B) => C) =>
	<A>(f1: (a: A) => B): ((a: A) => C) =>
	(a: A) =>
		f2(f1(a));

export const clamp =
	(min: number, max: number) =>
	(value: number): number =>
		Math.min(Math.max(value, min), max);

export const lerp = (start: number, end: number, factor: number): number => start + (end - start) * clamp(0, 1)(factor);

export const isFunction = (fn: unknown): fn is (...args: never[]) => unknown => typeof fn === "function";

export const isObject = (obj: unknown): obj is Record<string, unknown> =>
	obj !== null && typeof obj === "object" && !Array.isArray(obj);

export const isNumber = (num: unknown): num is number => typeof num === "number" && !Number.isNaN(num);

export const isString = (str: unknown): str is string => typeof str === "string";
