// Transition Constants
import type { TransitionMode } from "./types";

export const DEFAULT_TRANSITION: Required<{
	mode: TransitionMode;
	duration: number;
	easing: string;
	enterClass: string;
	enterActiveClass: string;
	enterToClass: string;
	leaveClass: string;
	leaveActiveClass: string;
	leaveToClass: string;
	css: boolean;
	appear: boolean;
}> = {
	mode: "fade",
	duration: 300,
	easing: "cubic-bezier(0.4, 0, 0.2, 1)",
	enterClass: "enter",
	enterActiveClass: "enter-active",
	enterToClass: "enter-to",
	leaveClass: "leave",
	leaveActiveClass: "leave-active",
	leaveToClass: "leave-to",
	css: true,
	appear: true,
};

export const TRANSITION_CLASSES: Record<TransitionMode, { enter: string[]; leave: string[] }> = {
	fade: {
		enter: ["opacity-0", "opacity-100"],
		leave: ["opacity-100", "opacity-0"],
	},
	slide: {
		enter: ["translate-x-full", "translate-x-0"],
		leave: ["translate-x-0", "-translate-x-full"],
	},
	zoom: {
		enter: ["scale-95", "scale-100"],
		leave: ["scale-100", "scale-95"],
	},
	scale: {
		enter: ["scale-90", "scale-100"],
		leave: ["scale-100", "scale-90"],
	},
	"fade-slide": {
		enter: ["opacity-0", "translate-y-4", "opacity-100", "translate-y-0"],
		leave: ["opacity-100", "translate-y-0", "opacity-0", "translate-y-4"],
	},
	"fade-zoom": {
		enter: ["opacity-0", "scale-95", "opacity-100", "scale-100"],
		leave: ["opacity-100", "scale-100", "opacity-0", "scale-95"],
	},
	none: {
		enter: [],
		leave: [],
	},
};
