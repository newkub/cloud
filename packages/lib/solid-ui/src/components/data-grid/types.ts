import type { ColumnDef, RowData } from "@tanstack/solid-table";
import type { JSX } from "solid-js";
import type { SurfaceVariant } from "../../lib/variants";
import type { features } from "./table";

export interface DataGridProps<TData extends RowData = RowData> {
	data?: TData[];
	columns?: ColumnDef<typeof features, TData, unknown>[];
	pageSize?: number;
	sortable?: boolean;
	paginate?: boolean;
	/** Global search input above the grid. @default true */
	filterable?: boolean;
	/** Row-selection checkboxes. @default false */
	selectable?: boolean;
	/** Column visibility menu. @default true */
	hideable?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	class?: string;
	onSelectionChange?: (rows: TData[]) => void;
	children?: JSX.Element;
}
