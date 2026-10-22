/**
 * Use case: Animation Chaining
 * Creates fluent API for chaining animations
 */

import {
	addFromChain,
	addFromToChain,
	addToChain,
	cancelChain,
	createAnimationChain as createChain,
	pauseChain,
	playChain,
	restartChain,
	reverseChain,
} from "../../../domain/models/advanced/animation-chain";
import type { AnimationParameters, AnimationTarget, ChainInstance } from "../../../types";

export function createAnimationChain(target: AnimationTarget): ChainInstance {
	let chain = createChain(target);

	return {
		to: (props: Record<string, unknown>, options?: AnimationParameters) => {
			chain = addToChain(chain, props, options);
			return createAnimationChain(target);
		},
		from: (props: Record<string, unknown>, options?: AnimationParameters) => {
			chain = addFromChain(chain, props, options);
			return createAnimationChain(target);
		},
		fromTo: (fromProps: Record<string, unknown>, toProps: Record<string, unknown>, options?: AnimationParameters) => {
			chain = addFromToChain(chain, fromProps, toProps, options);
			return createAnimationChain(target);
		},
		play: () => {
			chain = playChain(chain);
		},
		pause: () => {
			chain = pauseChain(chain);
		},
		reverse: () => {
			chain = reverseChain(chain);
		},
		restart: () => {
			chain = restartChain(chain);
		},
		cancel: () => {
			chain = cancelChain(chain);
		},
	};
}
