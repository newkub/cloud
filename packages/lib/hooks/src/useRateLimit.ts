import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface RateLimitState {
	/** Consume one token — returns true when the action is allowed */
	tryAcquire: () => boolean;
	/** Tokens currently available — fractional, 0…capacity */
	tokens: Accessor<number>;
	/** Force a refill pass — runs automatically on a 100 ms tick */
	refill: () => void;
}

/**
 * Token-bucket rate limiter — `capacity` tokens refill at `refillPerSec`.
 * `tryAcquire()` spends one token and reports whether the call is allowed;
 * the bucket refills on a timer while mounted (SSR-safe — no timers server-side).
 *
 * @param capacity — Maximum tokens the bucket can hold
 * @param refillPerSec — Tokens regenerated per second
 * @returns `{ tryAcquire, tokens, refill }`
 *
 * @example
 * const limiter = useRateLimit(5, 1);
 * <button onClick={() => limiter.tryAcquire() && fire()}>fire ({Math.floor(limiter.tokens())})</button>
 */
export function useRateLimit(capacity: number, refillPerSec: number): RateLimitState {
	const [tokens, setTokens] = createSignal(capacity);
	let last = Date.now();

	const refill = () => {
		const now = Date.now();
		const elapsed = now - last;
		last = now;
		if (elapsed <= 0) return;
		setTokens((t) => Math.min(capacity, t + (elapsed / 1000) * refillPerSec));
	};

	const tryAcquire = () => {
		refill();
		if (tokens() < 1) return false;
		setTokens((t) => t - 1);
		return true;
	};

	onMount(() => {
		const id = setInterval(refill, 100);
		onCleanup(() => clearInterval(id));
	});

	return { tryAcquire, tokens, refill };
}
