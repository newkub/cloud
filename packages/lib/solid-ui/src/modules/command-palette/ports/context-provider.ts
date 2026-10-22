/**
 * Context Provider Port - Interface for context-aware command filtering
 */

import type { Command } from "../types";
import type { CommandContext, ContextFilter, ContextMatchResult } from "../types/integration/context";

export interface ContextProvider {
	getCurrentContext(): CommandContext;
	setContext(context: CommandContext): void;
	matchCommandContext(command: Command, filter: ContextFilter): ContextMatchResult;
	filterCommandsByContext(commands: readonly Command[], filter: ContextFilter): readonly Command[];
}
