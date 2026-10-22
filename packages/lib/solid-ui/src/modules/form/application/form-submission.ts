import type { FieldValue, FormSubmission } from "../domain/models";

export function createSubmit<T = Record<string, FieldValue>>(
	setIsSubmitting: (value: boolean) => void,
	setIsSubmitted: (value: boolean) => void,
	setSubmitCount: (setter: (prev: number) => number) => void,
	validate: () => boolean,
	errors: () => Record<string, string[]>,
	values: () => Record<string, FieldValue>,
	submitCount: () => number,
	config: {
		preventInvalidSubmit?: boolean;
		resetOnSubmit?: boolean;
	},
	onSubmit?: (values: Record<string, FieldValue>) => Promise<void> | void,
	reset?: () => void,
) {
	return async (data?: T): Promise<FormSubmission<T>> => {
		setIsSubmitting(true);
		setIsSubmitted(false);
		setSubmitCount((c) => c + 1);

		try {
			const valid = validate();

			if (!valid && config.preventInvalidSubmit) {
				setIsSubmitting(false);
				return {
					values: (data || values()) as T,
					errors: errors(),
					isValid: false,
					isSubmitting: false,
					isSubmitted: true,
					submitCount: submitCount(),
				};
			}

			if (onSubmit) {
				await onSubmit(values());
			}

			if (config.resetOnSubmit && reset) {
				reset();
			}

			return {
				values: (data || values()) as T,
				errors: errors(),
				isValid: valid,
				isSubmitting: false,
				isSubmitted: true,
				submitCount: submitCount(),
			};
		} catch (_error) {
			return {
				values: (data || values()) as T,
				errors: errors(),
				isValid: false,
				isSubmitting: false,
				isSubmitted: true,
				submitCount: submitCount(),
			};
		} finally {
			setIsSubmitting(false);
		}
	};
}
