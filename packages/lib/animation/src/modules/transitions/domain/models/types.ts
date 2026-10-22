// Transition Types
export type TransitionMode = "fade" | "slide" | "zoom" | "scale" | "fade-slide" | "fade-zoom" | "none";

export interface TransitionOptions {
	mode?: TransitionMode;
	duration?: number;
	easing?: string;
	enterClass?: string;
	enterActiveClass?: string;
	enterToClass?: string;
	leaveClass?: string;
	leaveActiveClass?: string;
	leaveToClass?: string;
	css?: boolean;
	appear?: boolean;
}

export interface TransitionState {
	isTransitioning: boolean;
	currentTransition: string | null;
	from: string | null;
	to: string | null;
}

export interface PageTransition {
	name: string;
	mode: TransitionMode;
	duration: number;
	easing: string;
}

export type TransitionHook = (transition: PageTransition) => void;

export interface TransitionStateInternal {
	readonly isEntering: boolean;
	readonly isLeaving: boolean;
	readonly isMounted: boolean;
	readonly isVisible: boolean;
}

export interface TransitionConfig {
	readonly mode: TransitionMode;
	readonly duration: number;
	readonly easing: string;
	readonly css?: boolean;
	readonly enterClass?: string;
	readonly enterActiveClass?: string;
	readonly enterToClass?: string;
	readonly leaveClass?: string;
	readonly leaveActiveClass?: string;
	readonly leaveToClass?: string;
}
