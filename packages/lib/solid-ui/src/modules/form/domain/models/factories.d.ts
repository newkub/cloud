import type { CheckboxField, FileField, NumberField, SelectField, TextareaField, TextField } from "./field-definitions";
export declare const createTextField: (name: string, label?: string, config?: Partial<TextField>) => TextField;
export declare const createEmailField: (name: string, label?: string, config?: Partial<TextField>) => TextField;
export declare const createPasswordField: (name: string, label?: string, config?: Partial<TextField>) => TextField;
export declare const createNumberField: (name: string, label?: string, config?: Partial<NumberField>) => NumberField;
export declare const createSelectField: (name: string, options: Array<{
    label: string;
    value: string;
}>, label?: string, config?: Partial<SelectField>) => SelectField;
export declare const createCheckboxField: (name: string, label?: string, config?: Partial<CheckboxField>) => CheckboxField;
export declare const createTextareaField: (name: string, label?: string, config?: Partial<TextareaField>) => TextareaField;
export declare const createFileField: (name: string, label?: string, config?: Partial<FileField>) => FileField;
