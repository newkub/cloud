// Validation Error Type and Factory
export type ValidationError = Readonly<{
	type: "ValidationError";
	message: string;
	field?: string;
}>;

export const ValidationError = (
	message: string,
	field?: string,
): ValidationError => ({
	type: "ValidationError",
	message,
	...(field !== undefined && { field }),
});
