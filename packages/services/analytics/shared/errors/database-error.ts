// Database Error Type and Factory
export type DatabaseError = Readonly<{
	type: "DatabaseError";
	message: string;
	originalError?: string;
}>;

export const DatabaseError = (
	message: string,
	originalError?: Error,
): DatabaseError => ({
	type: "DatabaseError",
	message,
	...(originalError !== undefined && { originalError: originalError.message }),
});
