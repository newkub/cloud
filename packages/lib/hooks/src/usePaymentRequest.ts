import { type Accessor, createSignal } from "solid-js";

export interface PaymentMethodDataLike {
	/** e.g. `"basic-card"`, `"https://pay.google.com/p/…"` */
	supportedMethods: string;
	data?: Record<string, unknown>;
}

export interface PaymentDetailsLike {
	total: { label: string; amount: { currency: string; value: string } };
	[key: string]: unknown;
}

export interface PaymentResponseLike {
	complete(result?: string): Promise<void>;
	[key: string]: unknown;
}

export interface PaymentRequestLike {
	canMakePayment(): Promise<boolean>;
	show(): Promise<PaymentResponseLike>;
	abort(): Promise<void>;
}

interface PaymentRequestCtor {
	new (
		methodData: ReadonlyArray<PaymentMethodDataLike>,
		details: PaymentDetailsLike,
		options?: Record<string, unknown>,
	): PaymentRequestLike;
}

export interface PaymentRequestControls {
	/** Whether the Payment Request API exists */
	supported: boolean;
	/** `new PaymentRequest(…).canMakePayment()` — `false` when unsupported or on error */
	canMakePayment: () => Promise<boolean>;
	/**
	 * Show the payment sheet — a fresh `PaymentRequest` is created per call
	 * (a request can only be shown once). Resolves `undefined` on cancel/error.
	 */
	show: () => Promise<PaymentResponseLike | undefined>;
	/** Last `PaymentResponse` — call `.complete()` on it to close the sheet */
	response: Accessor<PaymentResponseLike | undefined>;
	/** Last error message */
	error: Accessor<string | undefined>;
}

/**
 * Payment Request API — holds `methodData`/`details`/`options` and builds a
 * fresh `PaymentRequest` for `canMakePayment()` and each `show()`. Resolves
 * benign fallbacks where `window.PaymentRequest` is missing.
 *
 * @param methodData — Accepted payment methods
 * @param details — Line items and total
 * @param options — e.g. `{ requestPayerEmail: true }`
 * @returns `{ supported, canMakePayment, show, response, error }`
 *
 * @example
 * const pay = usePaymentRequest([{ supportedMethods: "basic-card" }], details);
 * <button disabled={!pay.supported} onClick={async () => (await pay.show())?.complete()}>pay</button>
 */
export function usePaymentRequest(
	methodData: ReadonlyArray<PaymentMethodDataLike>,
	details: PaymentDetailsLike,
	options?: Record<string, unknown>,
): PaymentRequestControls {
	const Ctor =
		typeof window === "undefined"
			? undefined
			: (window as unknown as { PaymentRequest?: PaymentRequestCtor }).PaymentRequest;
	const supported = !!Ctor;
	const [response, setResponse] = createSignal<PaymentResponseLike>();
	const [error, setError] = createSignal<string>();

	const create = () => (Ctor ? new Ctor(methodData, details, options) : undefined);
	const fail = (e: unknown) => setError(e instanceof Error ? e.message : "PaymentRequest failed");

	return {
		supported,
		canMakePayment: async () => {
			const req = create();
			if (!req) return false;
			try {
				return await req.canMakePayment();
			} catch (e) {
				fail(e);
				return false;
			}
		},
		show: async () => {
			const req = create();
			if (!req) return undefined;
			try {
				const res = await req.show();
				setResponse(res);
				setError(undefined);
				return res;
			} catch (e) {
				fail(e);
				return undefined;
			}
		},
		response,
		error,
	};
}
