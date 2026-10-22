import type { DraggableCallbacks, DraggableOptions } from "../../shared/types/draggable";

/**
 * Draggable infrastructure - Handles drag interactions (Functional style)
 */

export type DraggableState = Readonly<{
	element: HTMLElement | null;
	options: DraggableOptions;
	callbacks: DraggableCallbacks;
	isDragging: boolean;
	position: { x: number; y: number };
	velocity: { x: number; y: number };
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	velocityX: number;
	velocityY: number;
	lastX: number;
	lastY: number;
	lastTime: number;
}>;

export const INITIAL_DRAGGABLE_STATE: DraggableState = {
	isDragging: false,
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	element: null as HTMLElement | null,
	startX: 0,
	startY: 0,
	currentX: 0,
	currentY: 0,
	lastX: 0,
	lastY: 0,
	lastTime: 0,
	velocityX: 0,
	velocityY: 0,
	options: {},
	callbacks: {},
};

export const createDraggable = (
	element: HTMLElement,
	options: DraggableOptions = {},
	callbacks: DraggableCallbacks = {},
): DraggableState => ({
	...INITIAL_DRAGGABLE_STATE,
	element,
	options,
	callbacks,
});

export const startDrag = (state: DraggableState, clientX: number, clientY: number): DraggableState => ({
	...state,
	isDragging: true,
	startX: clientX - state.currentX,
	startY: clientY - state.currentY,
	lastX: clientX,
	lastY: clientY,
	lastTime: performance.now(),
	velocityX: 0,
	velocityY: 0,
});

const applyBounds = (
	x: number,
	y: number,
	bounds: { left?: number; right?: number; top?: number; bottom?: number },
): { x: number; y: number } => {
	let newX = x;
	let newY = y;

	if (bounds.left !== undefined) {
		newX = Math.max(newX, bounds.left);
	}
	if (bounds.right !== undefined) {
		newX = Math.min(newX, bounds.right);
	}
	if (bounds.top !== undefined) {
		newY = Math.max(newY, bounds.top);
	}
	if (bounds.bottom !== undefined) {
		newY = Math.min(newY, bounds.bottom);
	}

	return { x: newX, y: newY };
};

export const updateDragPosition = (state: DraggableState, clientX: number, clientY: number): DraggableState => {
	const now = performance.now();
	const delta = now - state.lastTime;

	let velocityX = state.velocityX;
	let velocityY = state.velocityY;
	let lastX = state.lastX;
	let lastY = state.lastY;
	let lastTime = state.lastTime;

	if (delta > 0) {
		velocityX = (clientX - lastX) / delta;
		velocityY = (clientY - lastY) / delta;
		lastX = clientX;
		lastY = clientY;
		lastTime = now;
	}

	let newX = clientX - state.startX;
	let newY = clientY - state.startY;

	// Apply axis constraints
	if (state.options.axis === "x") {
		newY = 0;
	} else if (state.options.axis === "y") {
		newX = 0;
	}

	// Apply bounds
	if (state.options.bounds) {
		const bounded = applyBounds(newX, newY, state.options.bounds);
		newX = bounded.x;
		newY = bounded.y;
	}

	// Apply snap
	if (state.options.snap) {
		newX = applySnap(newX, state.options.snap);
		newY = applySnap(newY, state.options.snap);
	}

	return {
		...state,
		currentX: newX,
		currentY: newY,
		velocityX,
		velocityY,
		lastX,
		lastY,
		lastTime,
	};
};

const applySnap = (value: number, snap: number | number[] | ((value: number) => number)): number => {
	if (typeof snap === "function") {
		return snap(value);
	}
	if (Array.isArray(snap)) {
		return snap.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
	}
	return Math.round(value / snap) * snap;
};

export const endDrag = (state: DraggableState): DraggableState => ({
	...state,
	isDragging: false,
});

export const applyInertiaPosition = (state: DraggableState): DraggableState => {
	const newVelocityX = state.velocityX * 0.95;
	const newVelocityY = state.velocityY * 0.95;

	if (Math.abs(newVelocityX) < 0.1 && Math.abs(newVelocityY) < 0.1) {
		return state;
	}

	let newX = state.currentX + newVelocityX * 16;
	let newY = state.currentY + newVelocityY * 16;

	// Apply bounds
	if (state.options.bounds) {
		const bounded = applyBounds(newX, newY, state.options.bounds);
		newX = bounded.x;
		newY = bounded.y;
	}

	return {
		...state,
		currentX: newX,
		currentY: newY,
		velocityX: newVelocityX,
		velocityY: newVelocityY,
	};
};

export const shouldContinueInertia = (state: DraggableState): boolean =>
	Math.abs(state.velocityX) >= 0.1 || Math.abs(state.velocityY) >= 0.1;
