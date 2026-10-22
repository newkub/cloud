import { createAnimate } from "../modules/animation/application/usecases/core/use-animate";
import { createSpringAnimation } from "../modules/animation/application/usecases/core/use-spring";
import { createStaggerFactory } from "../modules/animation/application/usecases/core/use-stagger";
import { createTimelineFactory } from "../modules/animation/application/usecases/core/use-timeline";
import { blendTransform, composeTransform, createDefaultScope, createScope, parseTransform } from "./browser";

/**
 * Main animation function
 * @param targets - CSS selector, DOM element, or object to animate
 * @param properties - CSS properties and values to animate
 * @param parameters - Animation parameters (duration, delay, easing, etc.)
 * @returns Animation instance with control methods
 */
export const animate = createAnimate();

/**
 * Create a spring animation with physics-based motion
 * @param options - Spring configuration (stiffness, damping, mass, velocity)
 * @returns Spring animation instance with control methods
 */
export const createSpring = createSpringAnimation;

/**
 * Create a timeline for sequencing animations
 * @returns Timeline instance with control methods
 */
export const createTimeline = createTimelineFactory();

/**
 * Create stagger function for time-offset animations
 * @param value - Stagger delay value
 * @param options - Stagger configuration (from, direction, grid, axis)
 * @returns Stagger function that calculates delays
 */
export const stagger = createStaggerFactory();

// Composition API
// Scope API
export { blendTransform, composeTransform, createDefaultScope, createScope, parseTransform };
