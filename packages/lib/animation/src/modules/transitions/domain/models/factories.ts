// Transition Factory Functions
import type { TransitionConfig, TransitionOptions, TransitionStateInternal } from "./types";

export const createTransitionState = (): TransitionStateInternal => ({
	isEntering: false,
	isLeaving: false,
	isMounted: false,
	isVisible: false,
});

export const createTransitionConfig = (options?: Partial<TransitionOptions>): TransitionConfig => {
	const config: TransitionConfig = {
		mode: options?.mode || "fade",
		duration: options?.duration || 300,
		easing: options?.easing || "ease-in-out",
		css: options?.css ?? true,
	};
	if (options?.enterClass) (config as { enterClass: string }).enterClass = options.enterClass;
	if (options?.enterActiveClass) (config as { enterActiveClass: string }).enterActiveClass = options.enterActiveClass;
	if (options?.enterToClass) (config as { enterToClass: string }).enterToClass = options.enterToClass;
	if (options?.leaveClass) (config as { leaveClass: string }).leaveClass = options.leaveClass;
	if (options?.leaveActiveClass) (config as { leaveActiveClass: string }).leaveActiveClass = options.leaveActiveClass;
	if (options?.leaveToClass) (config as { leaveToClass: string }).leaveToClass = options.leaveToClass;
	return config;
};
