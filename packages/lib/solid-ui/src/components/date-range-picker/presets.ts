import { addDaysISO, todayISO, toISODate } from "../date-helpers";
import type { DateRangePreset } from "./types";

/** Built-in presets: Today, Last 7 days, Last 30 days, This month. */
export const defaultRangePresets: DateRangePreset[] = [
	{
		label: "Today",
		value: () => ({ start: todayISO(), end: todayISO() }),
	},
	{
		label: "Last 7 days",
		value: () => ({ start: addDaysISO(todayISO(), -6), end: todayISO() }),
	},
	{
		label: "Last 30 days",
		value: () => ({ start: addDaysISO(todayISO(), -29), end: todayISO() }),
	},
	{
		label: "This month",
		value: () => {
			const now = new Date();
			return {
				start: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)),
				end: toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
			};
		},
	},
];
