import type { JSX } from "solid-js";
import type { Elevation, Radius, SurfaceVariant } from "../../lib/variants";
import type { CsvField } from "../CsvColumnMapper";

export interface CsvData {
	columns: string[];
	rows: string[][];
}

export interface ImportResult extends CsvData {
	/** Uploaded file name, when a file was chosen. */
	fileName?: string;
	/** Field key → column name mapping. */
	mapping: Record<string, string>;
}

export interface DataImportWizardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Target fields to map CSV columns onto. */
	fields: CsvField[];
	/** Preloaded CSV data — used until/unless a file is uploaded. */
	csv?: CsvData;
	/** Called with the final result on the Confirm step. */
	onComplete?: (result: ImportResult) => void;
	/** Called whenever the active step changes. */
	onStepChange?: (index: number) => void;
	/** Button labels. */
	labels?: { back?: string; next?: string; finish?: string };
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}
