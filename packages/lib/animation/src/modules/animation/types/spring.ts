/**
 * Spring Animation Types
 */

export interface SpringOptions {
	stiffness?: number;
	damping?: number;
	mass?: number;
	velocity?: number;
}

export interface SpringState {
	currentValue: number;
	velocity: number;
	isSettled: boolean;
}
