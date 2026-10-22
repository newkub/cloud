import type { DateColumn, NumberColumn } from "../models";
export declare const formatNumber: (value: number, column: NumberColumn) => string;
export declare const formatDate: (value: string | Date, column: DateColumn) => string;
export declare const formatCurrency: (value: number, currency?: string) => string;
export declare const formatPercent: (value: number, decimals?: number) => string;
