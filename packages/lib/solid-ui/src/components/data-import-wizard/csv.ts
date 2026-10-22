import type { CsvData } from "./types";

export function parseCsv(text: string): CsvData {
	const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
	const [head, ...rest] = lines;
	return {
		columns: (head ?? "").split(",").map((s) => s.trim()),
		rows: rest.map((l) => l.split(",").map((s) => s.trim())),
	};
}
