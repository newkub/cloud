// Table Config Validators - Table configuration validators
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import { tableConfigSchema } from "./schemas/table-config";

export const validateTableConfig = (value: unknown): value is typeof tableConfigSchema.infer => {
	const result = tableConfigSchema(value);
	return !(result instanceof type.errors);
};
