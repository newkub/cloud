/**
 * Infrastructure Errors
 */

import type { BaseError } from "./base-error";
import { createError } from "./base-error";

export interface DatabaseError extends BaseError {
	readonly _tag: "DatabaseError";
	readonly code: "DATABASE_ERROR";
	readonly type: "INFRASTRUCTURE";
	readonly operation: string;
	readonly cause?: string;
}

export const DatabaseError = (operation: string, cause?: Error, context?: Record<string, unknown>): DatabaseError =>
	({
		...createError(
			"DatabaseError",
			"DATABASE_ERROR",
			"INFRASTRUCTURE",
			`Database operation "${operation}" failed`,
			context,
		),
		operation,
		cause: cause?.message,
	}) as DatabaseError;

export interface FileSystemError extends BaseError {
	readonly _tag: "FileSystemError";
	readonly code: "FILE_SYSTEM_ERROR";
	readonly type: "INFRASTRUCTURE";
	readonly operation: string;
	readonly path: string;
	readonly cause?: string;
}

export const FileSystemError = (
	operation: string,
	path: string,
	cause?: Error,
	context?: Record<string, unknown>,
): FileSystemError =>
	({
		...createError(
			"FileSystemError",
			"FILE_SYSTEM_ERROR",
			"INFRASTRUCTURE",
			`File system operation "${operation}" failed for path "${path}"`,
			context,
		),
		operation,
		path,
		cause: cause?.message,
	}) as FileSystemError;

export interface NetworkError extends BaseError {
	readonly _tag: "NetworkError";
	readonly code: "NETWORK_ERROR";
	readonly type: "INFRASTRUCTURE";
	readonly operation: string;
	readonly url: string;
	readonly cause?: string;
}

export const NetworkError = (
	operation: string,
	url: string,
	cause?: Error,
	context?: Record<string, unknown>,
): NetworkError =>
	({
		...createError(
			"NetworkError",
			"NETWORK_ERROR",
			"INFRASTRUCTURE",
			`Network operation "${operation}" failed for URL "${url}"`,
			context,
		),
		operation,
		url,
		cause: cause?.message,
	}) as NetworkError;

export interface ConfigurationError extends BaseError {
	readonly _tag: "ConfigurationError";
	readonly code: "CONFIGURATION_ERROR";
	readonly type: "INFRASTRUCTURE";
	readonly key: string;
}

export const ConfigurationError = (
	key: string,
	message: string,
	context?: Record<string, unknown>,
): ConfigurationError =>
	({
		...createError(
			"ConfigurationError",
			"CONFIGURATION_ERROR",
			"INFRASTRUCTURE",
			`Configuration error for key "${key}": ${message}`,
			context,
		),
		key,
	}) as ConfigurationError;
