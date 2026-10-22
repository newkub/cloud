// Transition Validation Functions
import { type } from "arktype";
import type { TransitionMode, TransitionOptions } from "../models";
import {
	cssClassNameSchema,
	transitionDurationSchema,
	transitionEasingSchema,
	transitionModeSchema,
	transitionOptionsSchema,
} from "./schemas";

export const validateTransitionMode = (mode: string): mode is TransitionMode => {
	const result = transitionModeSchema(mode);
	return !(result instanceof type.errors);
};

export const validateTransitionDuration = (duration: number): boolean => {
	const result = transitionDurationSchema(duration);
	return !(result instanceof type.errors);
};

export const validateTransitionEasing = (easing: string): boolean => {
	const result = transitionEasingSchema(easing);
	return !(result instanceof type.errors);
};

export const validateTransitionOptions = (options: TransitionOptions): boolean => {
	const result = transitionOptionsSchema(options);
	return !(result instanceof type.errors);
};

export const validateCssClassName = (className: string): boolean => {
	const result = cssClassNameSchema(className);
	return !(result instanceof type.errors);
};
