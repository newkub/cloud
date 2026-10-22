/**
 * Command Events - Domain event types for commands
 * Pure event definitions without handlers
 */

import type { DomainEvent } from "../../shared/types";
import type { Command, CommandExecutionResult } from "../../types";

// Command created event
export interface CommandCreatedEvent extends DomainEvent {
	readonly type: "command.created";
	readonly command: Command;
}

// Command updated event
export interface CommandUpdatedEvent extends DomainEvent {
	readonly type: "command.updated";
	readonly commandId: string;
	readonly previousCommand: Command;
	readonly updatedCommand: Command;
}

// Command deleted event
export interface CommandDeletedEvent extends DomainEvent {
	readonly type: "command.deleted";
	readonly commandId: string;
	readonly deletedCommand: Command;
}

// Command executed event
export interface CommandExecutedEvent extends DomainEvent {
	readonly type: "command.executed";
	readonly commandId: string;
	readonly executionResult: CommandExecutionResult;
}

// Command enabled/disabled events
export interface CommandEnabledEvent extends DomainEvent {
	readonly type: "command.enabled";
	readonly commandId: string;
	readonly command: Command;
}

export interface CommandDisabledEvent extends DomainEvent {
	readonly type: "command.disabled";
	readonly commandId: string;
	readonly command: Command;
}

// Command search events
export interface CommandSearchedEvent extends DomainEvent {
	readonly type: "command.searched";
	readonly query: string;
	readonly resultsCount: number;
	readonly executionTime: number;
}

// Command category events
export interface CommandCategoryChangedEvent extends DomainEvent {
	readonly type: "command.category.changed";
	readonly commandId: string;
	readonly previousCategory?: string;
	readonly newCategory?: string;
}

// Command hotkey events
export interface CommandHotkeyChangedEvent extends DomainEvent {
	readonly type: "command.hotkey.changed";
	readonly commandId: string;
	readonly previousHotkey?: string;
	readonly newHotkey?: string;
}

// Event factory functions
export const createCommandCreatedEvent = (command: Command): CommandCreatedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.created",
	command,
});

export const createCommandUpdatedEvent = (
	commandId: string,
	previousCommand: Command,
	updatedCommand: Command,
): CommandUpdatedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.updated",
	commandId,
	previousCommand,
	updatedCommand,
});

export const createCommandDeletedEvent = (commandId: string, deletedCommand: Command): CommandDeletedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.deleted",
	commandId,
	deletedCommand,
});

export const createCommandExecutedEvent = (
	commandId: string,
	executionResult: CommandExecutionResult,
): CommandExecutedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.executed",
	commandId,
	executionResult,
});

export const createCommandEnabledEvent = (commandId: string, command: Command): CommandEnabledEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.enabled",
	commandId,
	command,
});

export const createCommandDisabledEvent = (commandId: string, command: Command): CommandDisabledEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.disabled",
	commandId,
	command,
});

export const createCommandSearchedEvent = (
	query: string,
	resultsCount: number,
	executionTime: number,
): CommandSearchedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.searched",
	query,
	resultsCount,
	executionTime,
});

export const createCommandCategoryChangedEvent = (
	commandId: string,
	previousCategory: string | undefined,
	newCategory: string | undefined,
): CommandCategoryChangedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.category.changed",
	commandId,
	previousCategory,
	newCategory,
});

export const createCommandHotkeyChangedEvent = (
	commandId: string,
	previousHotkey: string | undefined,
	newHotkey: string | undefined,
): CommandHotkeyChangedEvent => ({
	id: generateEventId(),
	timestamp: new Date(),
	type: "command.hotkey.changed",
	commandId,
	previousHotkey,
	newHotkey,
});

// Union type for all command events
export type CommandEvent =
	| CommandCreatedEvent
	| CommandUpdatedEvent
	| CommandDeletedEvent
	| CommandExecutedEvent
	| CommandEnabledEvent
	| CommandDisabledEvent
	| CommandSearchedEvent
	| CommandCategoryChangedEvent
	| CommandHotkeyChangedEvent;

// Helper function
const generateEventId = (): string => {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 15);
	return `evt_${timestamp}_${random}`;
};
