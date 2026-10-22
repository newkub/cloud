// Transitions Domain Validators - Public API
// Following /follow-arktype workflow for type-safe runtime validation

export type {
	CssClassName,
	TransitionDuration,
	TransitionEasing,
	TransitionModeSchema,
	TransitionOptionsSchema,
} from "./schemas";

export {
	cssClassNameSchema,
	transitionDurationSchema,
	transitionEasingSchema,
	transitionModeSchema,
	transitionOptionsSchema,
} from "./schemas";

export {
	validateCssClassName,
	validateTransitionDuration,
	validateTransitionEasing,
	validateTransitionMode,
	validateTransitionOptions,
} from "./validation-functions";
