/**
 * Use case: Animation Inspector
 * Creates and manages animation inspection tools
 */

import { AnimationInspector } from "../../../domain/models/advanced/index";
import type { AnimationInspectorData, InspectorOptions } from "../../../types/index";

export function createAnimationInspector(options: InspectorOptions = {}) {
	const inspector = new AnimationInspector(options);

	return {
		registerAnimation: (id: string, data: AnimationInspectorData) => {
			inspector.registerAnimation(id, data);
		},
		unregisterAnimation: (id: string) => {
			inspector.unregisterAnimation(id);
		},
		updateAnimation: (id: string, data: Partial<AnimationInspectorData>) => {
			inspector.updateAnimation(id, data);
		},
		getAnimationData: (id: string) => {
			return inspector.getAnimationData(id);
		},
		getAllAnimations: () => {
			return inspector.getAllAnimations();
		},
		dispose: () => {
			inspector.dispose();
		},
	};
}
