/**
 * SolidJS composable for Animation Chaining
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createAnimationChain } from "../../../modules/animation/application/usecases/advanced";
import type { AnimationParameters, AnimationTarget, ChainInstance } from "../../../modules/animation/types";

export function useAnimationChain(target: AnimationTarget) {
	const [chain, setChain] = createSignal<ChainInstance | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);

	const createChainInstance = () => {
		const c = createAnimationChain(target);
		setChain(c);
		return c;
	};

	const to = (props: Record<string, unknown>, options?: AnimationParameters) => {
		const c = chain() || createChainInstance();
		const newChain = c.to(props, options);
		setChain(newChain);
		return newChain;
	};

	const from = (props: Record<string, unknown>, options?: AnimationParameters) => {
		const c = chain() || createChainInstance();
		const newChain = c.from(props, options);
		setChain(newChain);
		return newChain;
	};

	const fromTo = (
		fromProps: Record<string, unknown>,
		toProps: Record<string, unknown>,
		options?: AnimationParameters,
	) => {
		const c = chain() || createChainInstance();
		const newChain = c.fromTo(fromProps, toProps, options);
		setChain(newChain);
		return newChain;
	};

	const play = () => {
		const c = chain();
		if (c) {
			c.play();
			setIsPlaying(true);
		}
	};

	const pause = () => {
		const c = chain();
		if (c) {
			c.pause();
			setIsPlaying(false);
		}
	};

	const reverse = () => {
		const c = chain();
		if (c) {
			c.reverse();
		}
	};

	const restart = () => {
		const c = chain();
		if (c) {
			c.restart();
			setIsPlaying(true);
		}
	};

	const cancel = () => {
		const c = chain();
		if (c) {
			c.cancel();
			setIsPlaying(false);
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createChainInstance();
		onCleanup(() => {
			instance?.cancel();
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
		cancel,
		isPlaying,
		chain,
	};
}
