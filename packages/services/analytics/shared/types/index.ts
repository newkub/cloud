/**
 * Shared Types
 * Common types used across the application
 */

export type Result<T, E = Error> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly error: E };

export type ResultUnknown<T> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly error: unknown };

export type Option<T> =
	| { readonly _tag: "Some"; readonly value: T }
	| { readonly _tag: "None" };

export type Either<L, R> = Result<R, L>;

// Analytics-specific shared types
export type EventType =
	| "page_view"
	| "click"
	| "form_submit"
	| "error"
	| "identify"
	| "revenue"
	| "custom"
	| "track"
	| "web_vital";

export type EventId = string;
export type SessionId = string;
export type UserId = string;
export type Timestamp = number;

export type EventProperties = Record<string, unknown>;

export type UTMParameters = Readonly<{
	source?: string;
	medium?: string;
	campaign?: string;
	term?: string;
	content?: string;
}>;
