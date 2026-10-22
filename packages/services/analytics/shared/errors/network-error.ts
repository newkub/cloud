// Network Error Type and Factory
export type NetworkError = Readonly<{
	type: "NetworkError";
	message: string;
	statusCode?: number;
}>;

export const NetworkError = (
	message: string,
	statusCode?: number,
): NetworkError => ({
	type: "NetworkError",
	message,
	...(statusCode !== undefined && { statusCode }),
});
