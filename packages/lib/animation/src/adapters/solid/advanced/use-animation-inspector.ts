/**
 * SolidJS composable for Animation Inspector
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createAnimationInspector } from "../../../modules/animation/application/usecases/advanced";
import type { AnimationInspectorData, InspectorOptions } from "../../../modules/animation/types";

export function useAnimationInspector(options: InspectorOptions = {}) {
	const [inspector, setInspector] = createSignal<ReturnType<typeof createAnimationInspector> | null>(null);
	const [animations, setAnimations] = createSignal<AnimationInspectorData[]>([]);

	const createInspectorInstance = () => {
		const ins = createAnimationInspector(options);
		setInspector(ins);
		setAnimations(ins.getAllAnimations());
		return ins;
	};

	const registerAnimation = (id: string, data: AnimationInspectorData) => {
		const ins = inspector() || createInspectorInstance();
		ins.registerAnimation(id, data);
		setAnimations(ins.getAllAnimations());
	};

	const unregisterAnimation = (id: string) => {
		const ins = inspector();
		if (ins) {
			ins.unregisterAnimation(id);
			setAnimations(ins.getAllAnimations());
		}
	};

	const updateAnimation = (id: string, data: Partial<AnimationInspectorData>) => {
		const ins = inspector();
		if (ins) {
			ins.updateAnimation(id, data);
			setAnimations(ins.getAllAnimations());
		}
	};

	const getAnimationData = (id: string) => {
		const ins = inspector();
		if (ins) {
			return ins.getAnimationData(id);
		}
		return undefined;
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createInspectorInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		registerAnimation,
		unregisterAnimation,
		updateAnimation,
		getAnimationData,
		animations,
		inspector,
	};
}
