// Unauthorized Error Type and Factory
export type UnauthorizedError = Readonly<{
	type: "UnauthorizedError";
	message: string;
}>;

export const UnauthorizedError = (
	message: string = "Unauthorized",
): UnauthorizedError => ({
	type: "UnauthorizedError",
	message,
});
