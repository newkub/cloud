// Table Module - Column Models
// Clean Architecture: Column type definitions

export interface BaseColumn {
	readonly key: string;
	readonly header: string;
	readonly width?: string | number;
	readonly minWidth?: string;
	readonly maxWidth?: string;
	readonly sortable?: boolean;
	readonly filterable?: boolean;
	readonly hidden?: boolean;
	readonly sticky?: boolean;
	readonly align?: "left" | "center" | "right";
	readonly verticalAlign?: "top" | "middle" | "bottom";
}

export interface TextColumn extends BaseColumn {
	readonly type: "string";
	readonly truncate?: boolean;
	readonly maxLength?: number;
	readonly uppercase?: boolean;
	readonly lowercase?: boolean;
}

export interface NumberColumn extends BaseColumn {
	readonly type: "number";
	readonly format?: "decimal" | "integer" | "percent" | "currency";
	readonly currency?: string;
	readonly locale?: string;
	readonly minFractionDigits?: number;
	readonly maxFractionDigits?: number;
}

export interface BooleanColumn extends BaseColumn {
	readonly type: "boolean";
	readonly trueLabel?: string;
	readonly falseLabel?: string;
	readonly trueColor?: string;
	readonly falseColor?: string;
}

export interface DateColumn extends BaseColumn {
	readonly type: "date" | "datetime" | "time";
	readonly format?: string;
	readonly relative?: boolean;
}

export interface CurrencyColumn extends BaseColumn {
	readonly type: "currency";
	readonly currency?: string;
	readonly locale?: string;
}

export interface PercentColumn extends BaseColumn {
	readonly type: "percent";
	readonly decimals?: number;
}

export interface EmailColumn extends BaseColumn {
	readonly type: "email";
	readonly link?: boolean;
}

export interface UrlColumn extends BaseColumn {
	readonly type: "url";
	readonly link?: boolean;
	readonly target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface ImageColumn extends BaseColumn {
	readonly type: "image";
	readonly altKey?: string;
	readonly width?: number;
	readonly height?: number;
	readonly rounded?: boolean;
	readonly circle?: boolean;
}

export interface BadgeColumn extends BaseColumn {
	readonly type: "badge";
	readonly variants?: Readonly<Record<string, Readonly<{ label: string; color?: string; bgColor?: string }>>>;
	readonly defaultVariant?: string;
}

export interface TagColumn extends BaseColumn {
	readonly type: "tag";
	readonly variants?: Readonly<Record<string, Readonly<{ label: string; color?: string; bgColor?: string }>>>;
	readonly defaultVariant?: string;
}

export interface AvatarColumn extends BaseColumn {
	readonly type: "avatar";
	readonly srcKey?: string;
	readonly altKey?: string;
	readonly nameKey?: string;
	readonly size?: number;
	readonly rounded?: boolean;
}

export interface ActionsColumn extends BaseColumn {
	readonly type: "actions";
	readonly items: ReadonlyArray<{
		readonly key: string;
		readonly label: string;
		readonly icon?: string;
		readonly variant?: "default" | "primary" | "danger";
		readonly disabled?: boolean;
	}>;
}

export interface CustomColumn extends BaseColumn {
	readonly type: "custom";
	readonly render: (value: unknown, row: Readonly<Record<string, unknown>>) => unknown;
}

export type ColumnDef =
	| TextColumn
	| NumberColumn
	| BooleanColumn
	| DateColumn
	| CurrencyColumn
	| PercentColumn
	| EmailColumn
	| UrlColumn
	| ImageColumn
	| BadgeColumn
	| TagColumn
	| AvatarColumn
	| ActionsColumn
	| CustomColumn;
