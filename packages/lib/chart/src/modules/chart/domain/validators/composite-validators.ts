// Composite validation
import type { ChartConfig, ValidationResult } from "../../types/index";
import { validateChartConfig } from "./config-validators";
import { validateChartData, validateLabels } from "./data-validators";
import { validateChartType } from "./type-validators";

export const validateCompleteChart = (config: ChartConfig): ValidationResult => {
	const configValidation = validateChartConfig(config);
	const dataValidation = validateChartData(config.data);
	const typeValidation = validateChartType(config.type, config.data);
	const labelsValidation = validateLabels(config.data.labels);

	const allErrors = [
		...configValidation.errors,
		...dataValidation.errors,
		...typeValidation.errors,
		...labelsValidation.errors,
	];

	// Remove duplicates
	const uniqueErrors = [...new Set(allErrors)];

	return {
		isValid: uniqueErrors.length === 0,
		errors: uniqueErrors,
	};
};
