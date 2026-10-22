// Export Use Cases
import type { ColumnDef } from "../../domain/models";

export interface ExportToCSVInput<T> {
	readonly data: ReadonlyArray<T>;
	readonly columns: ReadonlyArray<ColumnDef>;
}

export interface ExportToCSVOutput {
	readonly csv: string;
}

/**
 * Export table data to CSV format
 */
export function exportToCSV<T>(input: ExportToCSVInput<T>): ExportToCSVOutput {
	const { data, columns } = input;
	const headers = columns.map((col) => col.header).join(",");
	const rows = data.map((row) => {
		return columns
			.map((col) => {
				const value = (row as Record<string, unknown>)[col.key];
				if (value === null || value === undefined) return "";
				if (typeof value === "string" && value.includes(",")) {
					return `"${value}"`;
				}
				return String(value);
			})
			.join(",");
	});

	return { csv: [headers, ...rows].join("\n") };
}

export interface ExportToJSONInput<T> {
	readonly data: ReadonlyArray<T>;
	readonly pretty?: boolean;
}

export interface ExportToJSONOutput {
	readonly json: string;
}

/**
 * Export table data to JSON format
 */
export function exportToJSON<T>(input: ExportToJSONInput<T>): ExportToJSONOutput {
	const { data, pretty = false } = input;
	return { json: JSON.stringify(data, null, pretty ? 2 : 0) };
}
