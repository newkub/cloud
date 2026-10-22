/**
 * Category Repository Port - Interface for category persistence
 * Defines contract for category storage operations
 */

import type { Result } from "../shared/types";
import type { CommandCategory } from "../types";

export interface CategoryRepository {
	// CRUD operations
	save(category: CommandCategory): Promise<Result<CommandCategory>>;
	findById(id: string): Promise<Result<CommandCategory | null>>;
	findAll(): Promise<Result<readonly CommandCategory[]>>;
	update(id: string, updates: Partial<CommandCategory>): Promise<Result<CommandCategory>>;
	delete(id: string): Promise<Result<void>>;

	// Query operations
	findByOrder(order: number): Promise<Result<readonly CommandCategory[]>>;
	findHidden(): Promise<Result<readonly CommandCategory[]>>;
	findVisible(): Promise<Result<readonly CommandCategory[]>>;

	// Count operations
	count(): Promise<Result<number>>;
	countHidden(): Promise<Result<number>>;
	countVisible(): Promise<Result<number>>;
}
