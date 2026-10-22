// Table Formatters

import type { DateColumn, NumberColumn } from "../models";

const formatRelativeDate = (date: Date): string => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 7) {
		return new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(date);
	}
	if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	return "Just now";
};

export const formatNumber = (value: number, column: NumberColumn): string => {
	if (value === null || value === undefined) return "";

	const locale = column.locale || "en-US";
	const minDigits = column.minFractionDigits ?? (column.format === "decimal" ? 0 : 2);
	const maxDigits = column.maxFractionDigits ?? 2;

	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: minDigits,
		maximumFractionDigits: maxDigits,
	}).format(value);
};

export const formatDate = (value: string | Date, column: DateColumn): string => {
	if (!value) return "";

	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";

	const format = column.format || "short";

	if (column.relative) {
		return formatRelativeDate(date);
	}

	return new Intl.DateTimeFormat("en-US", {
		dateStyle: format as "short" | "medium" | "long" | "full",
		timeStyle: column.type === "datetime" ? "short" : undefined,
	}).format(date);
};

export const formatCurrency = (value: number, currency = "USD"): string => {
	if (value === null || value === undefined) return "";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(value);
};

export const formatPercent = (value: number, decimals = 0): string => {
	if (value === null || value === undefined) return "";
	return `${(value * 100).toFixed(decimals)}%`;
};
