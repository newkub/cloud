/**
 * Domain Errors
 */

import type { BaseError } from "./base-error";
import { createError } from "./base-error";

export interface CommandNotFoundError extends BaseError {
	readonly _tag: "CommandNotFoundError";
	readonly code: "COMMAND_NOT_FOUND";
	readonly type: "DOMAIN";
	readonly commandId: string;
}

export const CommandNotFoundError = (commandId: string, context?: Record<string, unknown>): CommandNotFoundError =>
	({
		...createError(
			"CommandNotFoundError",
			"COMMAND_NOT_FOUND",
			"DOMAIN",
			`Command with id "${commandId}" not found`,
			context,
		),
		commandId,
	}) as CommandNotFoundError;

export interface CommandAlreadyExistsError extends BaseError {
	readonly _tag: "CommandAlreadyExistsError";
	readonly code: "COMMAND_ALREADY_EXISTS";
	readonly type: "DOMAIN";
	readonly commandId: string;
}

export const CommandAlreadyExistsError = (
	commandId: string,
	context?: Record<string, unknown>,
): CommandAlreadyExistsError =>
	({
		...createError(
			"CommandAlreadyExistsError",
			"COMMAND_ALREADY_EXISTS",
			"DOMAIN",
			`Command with id "${commandId}" already exists`,
			context,
		),
		commandId,
	}) as CommandAlreadyExistsError;

export interface InvalidCommandActionError extends BaseError {
	readonly _tag: "InvalidCommandActionError";
	readonly code: "INVALID_COMMAND_ACTION";
	readonly type: "DOMAIN";
	readonly action: string;
}

export const InvalidCommandActionError = (
	action: string,
	context?: Record<string, unknown>,
): InvalidCommandActionError =>
	({
		...createError(
			"InvalidCommandActionError",
			"INVALID_COMMAND_ACTION",
			"DOMAIN",
			`Invalid command action: ${action}`,
			context,
		),
		action,
	}) as InvalidCommandActionError;
