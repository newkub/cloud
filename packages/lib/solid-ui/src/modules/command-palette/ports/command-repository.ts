/**
 * Command Repository Port - Interface for command persistence
 * Defines contract for command storage operations
 */

import type { PaginatedResult, Result } from "../shared/types";
import type { Command, CommandSearchQuery } from "../types";

export interface CommandRepository {
	// CRUD operations
	save(command: Command): Promise<Result<Command>>;
	findById(id: string): Promise<Result<Command | null>>;
	findAll(): Promise<Result<readonly Command[]>>;
	update(id: string, updates: Partial<Command>): Promise<Result<Command>>;
	delete(id: string): Promise<Result<void>>;

	// Search operations
	search(query: CommandSearchQuery): Promise<Result<readonly Command[]>>;
	searchPaginated(query: CommandSearchQuery): Promise<Result<PaginatedResult<Command>>>;

	// Category operations
	findByCategory(category: string): Promise<Result<readonly Command[]>>;
	getAllCategories(): Promise<Result<readonly string[]>>;

	// State operations
	enableCommand(id: string): Promise<Result<Command>>;
	disableCommand(id: string): Promise<Result<Command>>;

	// Bulk operations
	saveMany(commands: readonly Command[]): Promise<Result<readonly Command[]>>;
	deleteMany(ids: readonly string[]): Promise<Result<void>>;

	// Count operations
	count(): Promise<Result<number>>;
	countByCategory(category: string): Promise<Result<number>>;
	countEnabled(): Promise<Result<number>>;
	countDisabled(): Promise<Result<number>>;
}
