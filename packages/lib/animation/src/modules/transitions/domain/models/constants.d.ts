import type { TransitionMode } from "./types";
export declare const DEFAULT_TRANSITION: Required<{
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
}>;
export declare const TRANSITION_CLASSES: Record<TransitionMode, {
    enter: string[];
    leave: string[];
}>;
