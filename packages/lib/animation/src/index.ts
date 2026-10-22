/**
 * Animation Module - Clean Architecture with Vertical Slice
 *
 * Structure:
 * - modules/animation/     - Feature module (Vertical Slice Architecture)
 *   - types/               - Domain type definitions
 *   - domain/              - Pure business logic
 *   - application/         - Orchestration layer
 *   - ports/               - Module-specific interfaces
 * - adapters/              - External system integrations
 * - shared/               - Shared kernel
 */

export {
	animate,
	createTimeline,
	stagger,
} from "./adapters/main-api";
export {
	cloneAnimation,
	createAnimation,
	updateAnimationState,
} from "./modules/animation/domain/models/core/animation";
export {
	getCustomEasing,
	getEasing,
	listEasingTypes,
	registerEasing,
} from "./modules/animation/domain/models/core/easing";
export {
	addAnimation,
	createTimeline as createTimelineEntity,
	removeAnimation,
	updateTimelineState,
} from "./modules/animation/domain/models/core/timeline";
export * from "./modules/animation/ports";
export * from "./modules/animation/types";
export * from "./shared/performance";
export * from "./shared/types";
