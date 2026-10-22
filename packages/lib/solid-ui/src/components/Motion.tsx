/**
 * Animation wrapper component
 */
import { createSignal, type JSX, mergeProps, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { paddingSizes, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface MotionStyle {
	opacity?: number;
	x?: number;
	y?: number;
	scale?: number;
	rotate?: number;
}

export interface MotionProps {
	as?: keyof JSX.IntrinsicElements;
	children: JSX.Element;
	initial?: MotionStyle;
	animate?: MotionStyle;
	transition?: {
		duration?: number;
		delay?: number;
		easing?: string;
	};
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	class?: string;
}

function buildStyle(state: MotionStyle) {
	return {
		opacity: state.opacity ?? 1,
		transform: `translate3d(${state.x ?? 0}px, ${state.y ?? 0}px, 0) scale(${state.scale ?? 1}) rotate(${state.rotate ?? 0}deg)`,
	};
}

const defaultInitial: MotionStyle = { opacity: 0, y: 16 };
const defaultAnimate: MotionStyle = { opacity: 1, y: 0 };
const defaultTransition: NonNullable<Required<MotionProps["transition"]>> = {
	duration: 300,
	delay: 0,
	easing: "ease-out",
};

function mergeValue(a: number | undefined, b: number | undefined, fallback: number) {
	return a ?? b ?? fallback;
}

export function Motion(props: MotionProps) {
	const merged = mergeProps(
		{ as: "div", initial: defaultInitial, animate: defaultAnimate, transition: defaultTransition },
		props,
	);
	const [state, setState] = createSignal<MotionStyle>(merged.initial);
	const duration = () => merged.transition?.duration ?? defaultTransition.duration;
	const delay = () => merged.transition?.delay ?? defaultTransition.delay;
	const easing = () => merged.transition?.easing ?? defaultTransition.easing;
	let raf = 0;
	onCleanup(() => cancelAnimationFrame(raf));

	onMount(() => {
		const start = merged.initial;
		const end = merged.animate;

		if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setState(end);
			return;
		}

		setState(start);
		const startTime = performance.now() + delay();

		function step(now: number) {
			const t = Math.min(Math.max((now - startTime) / (duration() || 1), 0), 1);
			const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
			const interpolate = (a: number, b: number) => a + (b - a) * ease;

			setState({
				opacity: interpolate(mergeValue(start.opacity, end.opacity, 1), mergeValue(end.opacity, start.opacity, 1)),
				x: interpolate(mergeValue(start.x, end.x, 0), mergeValue(end.x, start.x, 0)),
				y: interpolate(mergeValue(start.y, end.y, 0), mergeValue(end.y, start.y, 0)),
				scale: interpolate(mergeValue(start.scale, end.scale, 1), mergeValue(end.scale, start.scale, 1)),
				rotate: interpolate(mergeValue(start.rotate, end.rotate, 0), mergeValue(end.rotate, start.rotate, 0)),
			});

			if (t < 1) raf = requestAnimationFrame(step);
		}

		raf = requestAnimationFrame(step);
	});

	const current = () => buildStyle(state());

	const className = () =>
		[
			merged.variant ? surfaceVariants[merged.variant] : "",
			merged.size ? paddingSizes[merged.size] : "",
			merged.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Dynamic
			component={merged.as as string}
			class={className()}
			style={{
				...current(),
				transition: `opacity ${duration()}ms ${easing()} ${delay()}ms, transform ${duration()}ms ${easing()} ${delay()}ms`,
			}}
		>
			{merged.children}
		</Dynamic>
	);
}
