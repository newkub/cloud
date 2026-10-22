// Table Column Builders

import type {
	ActionsColumn,
	BadgeColumn,
	BooleanColumn,
	CustomColumn,
	DateColumn,
	EmailColumn,
	ImageColumn,
	NumberColumn,
	TagColumn,
	TextColumn,
	UrlColumn,
} from "../models";

export const textColumn = (key: string, header: string, options?: Partial<TextColumn>): TextColumn => ({
	key,
	header,
	type: "string",
	...options,
});

export const numberColumn = (key: string, header: string, options?: Partial<NumberColumn>): NumberColumn => ({
	key,
	header,
	type: "number",
	...options,
});

export const dateColumn = (key: string, header: string, options?: Partial<DateColumn>): DateColumn => ({
	key,
	header,
	type: "date",
	...options,
});

export const boolColumn = (key: string, header: string, options?: Partial<BooleanColumn>): BooleanColumn => ({
	key,
	header,
	type: "boolean",
	...options,
});

export const badgeColumn = (key: string, header: string, options?: Partial<BadgeColumn>): BadgeColumn => ({
	key,
	header,
	type: "badge",
	...options,
});

export const tagColumn = (key: string, header: string, options?: Partial<TagColumn>): TagColumn => ({
	key,
	header,
	type: "tag",
	...options,
});

export const imageColumn = (key: string, header: string, options?: Partial<ImageColumn>): ImageColumn => ({
	key,
	header,
	type: "image",
	...options,
});

export const emailColumn = (key: string, header: string, options?: Partial<EmailColumn>): EmailColumn => ({
	key,
	header,
	type: "email",
	...options,
});

export const urlColumn = (key: string, header: string, options?: Partial<UrlColumn>): UrlColumn => ({
	key,
	header,
	type: "url",
	...options,
});

export const actionsColumn = (key: string, header: string, items: ActionsColumn["items"]): ActionsColumn => ({
	key,
	header,
	type: "actions",
	items,
});

export const customColumn = (
	key: string,
	header: string,
	render: (value: unknown, row: Readonly<Record<string, unknown>>) => unknown,
): CustomColumn => ({
	key,
	header,
	type: "custom",
	render,
});
