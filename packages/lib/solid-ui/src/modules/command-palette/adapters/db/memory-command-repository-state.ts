/**
 * Memory Command Repository State
 */

import type { Command } from "../../types";

export type MemoryCommandRepositoryState = Readonly<{
	commands: Map<string, Command>;
}>;
