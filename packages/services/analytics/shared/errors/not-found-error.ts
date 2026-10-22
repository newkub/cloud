// Not Found Error Type and Factory
export type NotFoundError = Readonly<{
	type: "NotFoundError";
	message: string;
	resource: string;
	id?: string;
}>;

export const NotFoundError = (
	resource: string,
	id?: string,
): NotFoundError => ({
	type: "NotFoundError",
	message: `${resource}${id ? ` with id ${id}` : ""} not found`,
	resource,
	...(id !== undefined && { id }),
});
