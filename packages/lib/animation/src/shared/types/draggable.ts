/**
 * Draggable types
 */

export type DraggableAxis = "x" | "y" | "xy";

export interface DraggableBounds {
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
}

export interface DraggableOptions {
	axis?: DraggableAxis;
	bounds?: DraggableBounds;
	container?: string | HTMLElement;
	inertia?: boolean;
	snap?: number | number[] | ((value: number) => number);
	trigger?: string | HTMLElement;
}

export interface DraggableCallbacks {
	onDrag?: (position: { x: number; y: number }) => void;
	onDragEnd?: () => void;
	onDragStart?: () => void;
	onSnap?: (value: number) => void;
	onThrow?: (velocity: { x: number; y: number }) => void;
}

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
