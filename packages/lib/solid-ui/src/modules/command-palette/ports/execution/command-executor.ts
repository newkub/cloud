/**
 * Command Executor Port - Interface for command execution
 */

import type { Command } from "../../types";

export interface CommandExecutor {
	execute(command: Command): Promise<void>;
}
