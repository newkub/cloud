/**
 * Quick Action Types
 */

import type { CommandAction } from "./command";

export interface QuickAction {
	readonly id: string;
	readonly label: string;
	readonly description?: string;
	readonly icon?: string;
	readonly action: CommandAction;
	readonly priority: number;
	readonly enabled: boolean;
}
