import { createDraggable, endDrag, startDrag, updateDragPosition } from "../../../../../adapters/browser/index";
import type { DraggableCallbacks, DraggableOptions, DraggableState } from "../../../../../shared/types/index";

/**
 * Use case: Create draggable elements
 */
export function createDraggableFactory() {
	return function createDraggableState(
		element: HTMLElement,
		options: DraggableOptions = {},
		callbacks: DraggableCallbacks = {},
	): DraggableState {
		return createDraggable(element, options, callbacks);
	};
}

export function createDraggableActions() {
	return {
		startDrag,
		updateDragPosition,
		endDrag,
	};
}
