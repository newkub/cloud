import { type Accessor, createSignal } from "solid-js";

/** Minimal structural shape of a Stripe.js instance. */
export interface StripeLike {
	confirmPayment: (options: unknown) => Promise<{ error?: { message: string } }>;
	confirmCardPayment?: (
		secret: string,
		data?: unknown,
	) => Promise<{ error?: { message: string }; paymentIntent?: unknown }>;
}

export type StripeStatus = "idle" | "processing" | "success" | "error";

export interface StripeOptions {
	/** Stripe.js instance or accessor resolving to one — feeds `isConfigured`
	 * and acts as the fallback client for `confirm()`. */
	stripe?: StripeLike | null | Accessor<StripeLike | null | undefined>;
}

export interface StripeState {
	status: Accessor<StripeStatus>;
	error: Accessor<string | undefined>;
	/** True once a Stripe.js instance is available — via options or a previous `confirm()` call */
	isConfigured: Accessor<boolean>;
	/** Wrap stripe.confirmPayment — sets status through the flow */
	confirm: (stripe: StripeLike, options: unknown) => Promise<boolean>;
	/** Back to "idle" and clears the error */
	reset: () => void;
}

/**
 * Stripe payment confirmation as a state machine — no SDK dependency,
 * pass the Stripe.js instance you loaded (per `confirm()` call or once via
 * `useStripe({ stripe })`).
 *
 * @param options — See {@link StripeOptions}
 * @returns `{ status, error, isConfigured, confirm, reset }`
 *
 * @example
 * const pay = useStripe({ stripe: () => stripeJs() });
 * const ok = await pay.confirm(stripeJs(), { elements, confirmParams: { return_url } });
 */
export function useStripe(options?: StripeOptions): StripeState {
	const [status, setStatus] = createSignal<StripeStatus>("idle");
	const [error, setError] = createSignal<string>();
	const [remembered, setRemembered] = createSignal<StripeLike>();

	const provided = () => {
		const s = options?.stripe;
		return typeof s === "function" ? s() : (s ?? undefined);
	};
	const isConfigured: Accessor<boolean> = () => !!(remembered() ?? provided());

	const confirm = async (stripe: StripeLike, opts: unknown) => {
		const client = stripe ?? provided();
		if (!client) {
			setError("Stripe is not configured — pass the instance to confirm() or useStripe({ stripe })");
			setStatus("error");
			return false;
		}
		setRemembered(client);
		setStatus("processing");
		setError(undefined);
		try {
			const res = await client.confirmPayment(opts);
			if (res.error) {
				setError(res.error.message);
				setStatus("error");
				return false;
			}
			setStatus("success");
			return true;
		} catch (e) {
			setError(e instanceof Error ? e.message : "payment failed");
			setStatus("error");
			return false;
		}
	};

	const reset = () => {
		setStatus("idle");
		setError(undefined);
	};

	return { status, error, isConfigured, confirm, reset };
}
