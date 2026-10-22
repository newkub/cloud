// ============================================================================
// Shared Kernel - Types Index
// ============================================================================

// Array helpers
export {
	filter,
	find,
	findIndex,
	head,
	includes,
	isEmpty,
	length,
	map,
	reduce,
	tail,
} from "./array-helpers";
// Async result helpers
export {
	asyncFailure,
	asyncSuccess,
	flatMapAsyncResult,
	mapAsyncResult,
} from "./async-result-helpers";
// Date helpers
export {
	now,
	parseISO,
	toISOString,
} from "./date-helpers";

// Either helpers
export {
	eitherToResult,
	flatMapEither,
	isLeft,
	isRight,
	left,
	mapEither,
	resultToEither,
	right,
} from "./either-helpers";
// Function composition
export {
	always,
	compose,
	curry,
	identity,
	pipe,
	pipeAsync,
} from "./function-composition";
// Number helpers
export {
	isGreaterThan,
	isLessThan,
	isNegative,
	isPositive,
	isZero,
} from "./number-helpers";
// Object helpers
export {
	omit,
	pick,
} from "./object-helpers";
// Option helpers
export {
	flatMapOption,
	fromNullable,
	isNone,
	isSome,
	mapOption,
	none,
	optionToResult,
	resultToOption,
	some,
} from "./option-helpers";
// Core result/either monad types
export type { AsyncResult, Either, Option, Result } from "./result-either";
// Result helpers
export {
	failure,
	flatMapResult,
	isFailure,
	isSuccess,
	mapError,
	mapResult,
	success,
} from "./result-helpers";
// String helpers
export {
	isEmptyString,
	isNotEmptyString,
	toLowerCase,
	toUpperCase,
	trim,
} from "./string-helpers";
// Validation helpers
export {
	validate,
	validateAsync,
} from "./validation-helpers";

// Stripe Module Configuration Types
export interface StripeModuleOptions {
	secretKey: string;
	publishableKey: string;
	webhookSecret: string;
	apiVersion: string;
	currency: string;
	locale: string;
	successUrl: string;
	cancelUrl: string;
}
