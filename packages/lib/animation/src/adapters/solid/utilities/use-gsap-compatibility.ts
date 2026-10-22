/**
 * SolidJS composable for GSAP Compatibility
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import {
	type GSAPTimeline,
	gsapTimeline,
	gsapTo,
} from "../../../modules/animation/application/usecases/utilities/use-gsap-compatibility";
import type { AnimationParameters, AnimationTarget } from "../../../modules/animation/types";

export function useGSAP(target: AnimationTarget) {
	const [timeline, setTimeline] = createSignal<GSAPTimeline | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);

	const createTimelineInstance = () => {
		const tl = gsapTimeline();
		setTimeline(tl);
		return tl;
	};

	const to = (props: Record<string, unknown>, options?: AnimationParameters & { onComplete?: () => void }) => {
		const anim = gsapTo(target, props, options);
		return {
			kill: () => anim.kill(),
		};
	};

	const from = (props: Record<string, unknown>, options?: AnimationParameters & { onComplete?: () => void }) => {
		const anim = gsapTo(target, props, options);
		return {
			kill: () => anim.kill(),
		};
	};

	const fromTo = (
		_fromProps: Record<string, unknown>,
		toProps: Record<string, unknown>,
		options?: AnimationParameters & { onComplete?: () => void },
	) => {
		const anim = gsapTo(target, toProps, options);
		return {
			kill: () => anim.kill(),
		};
	};

	const play = () => {
		const tl = timeline();
		if (tl) {
			tl.play();
			setIsPlaying(true);
		}
	};

	const pause = () => {
		const tl = timeline();
		if (tl) {
			tl.pause();
			setIsPlaying(false);
		}
	};

	const reverse = () => {
		const tl = timeline();
		if (tl) {
			tl.reverse();
		}
	};

	const restart = () => {
		const tl = timeline();
		if (tl) {
			tl.restart();
			setIsPlaying(true);
		}
	};

	const kill = () => {
		const tl = timeline();
		if (tl) {
			tl.kill();
			setIsPlaying(false);
		}
	};

	// Auto-create timeline on mount
	createEffect(() => {
		const instance = createTimelineInstance();
		onCleanup(() => {
			instance?.kill();
		});
	});

	return {
		to,
		from,
		fromTo,
		play,
		pause,
		reverse,
		restart,
		kill,
		isPlaying,
		timeline,
	};
}
