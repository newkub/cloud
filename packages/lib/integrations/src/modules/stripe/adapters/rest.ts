// ============================================================================
// Stripe Integration — lightweight REST adapter using the Stripe API directly
// Full port from @wrikka/stripe is pending the package build (dist missing)
// ============================================================================

export interface StripeConfig {
	secretKey: string;
	baseUrl?: string;
}

export interface StripeCheckoutSession {
	id: string;
	url: string | null;
	status: string;
}

export interface StripePaymentIntent {
	id: string;
	client_secret: string | null;
	status: string;
	amount: number;
	currency: string;
}

export interface StripeClientPort {
	createCheckoutSession(params: {
		line_items: Array<{ price: string; quantity: number }>;
		mode?: "payment" | "subscription";
		success_url: string;
		cancel_url: string;
	}): Promise<StripeCheckoutSession>;

	getSession(id: string): Promise<StripeCheckoutSession>;

	createPaymentIntent(params: {
		amount: number;
		currency: string;
		metadata?: Record<string, string>;
	}): Promise<StripePaymentIntent>;
}

class StripeRestAdapter implements StripeClientPort {
	private readonly baseUrl: string;
	private readonly secretKey: string;

	constructor(config: StripeConfig) {
		this.baseUrl = config.baseUrl ?? "https://api.stripe.com";
		this.secretKey = config.secretKey;
	}

	private async request<T>(
		path: string,
		body?: Record<string, unknown>,
	): Promise<T> {
		const url = `${this.baseUrl}/v1${path}`;
		const res = await fetch(url, {
			method: body ? "POST" : "GET",
			headers: {
				Authorization: `Bearer ${this.secretKey}`,
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: body ? new URLSearchParams(this.flatten(body)) : undefined,
		});

		if (!res.ok) {
			throw new Error(`Stripe API error: ${res.status} ${res.statusText}`);
		}

		return (await res.json()) as T;
	}

	private flatten(
		obj: Record<string, unknown>,
		prefix = "",
	): Record<string, string> {
		const result: Record<string, string> = {};
		for (const [key, value] of Object.entries(obj)) {
			const newKey = prefix ? `${prefix}[${key}]` : key;
			if (value === null || value === undefined) {
				continue;
			}
			if (Array.isArray(value)) {
				for (let i = 0; i < value.length; i++) {
					const item = value[i];
					if (item && typeof item === "object") {
						Object.assign(
							result,
							this.flatten(item as Record<string, unknown>, `${newKey}[${i}]`),
						);
					} else {
						result[`${newKey}[${i}]`] = String(item);
					}
				}
			} else if (typeof value === "object") {
				Object.assign(
					result,
					this.flatten(value as Record<string, unknown>, newKey),
				);
			} else {
				result[newKey] = String(value);
			}
		}
		return result;
	}

	async createCheckoutSession(params: {
		line_items: Array<{ price: string; quantity: number }>;
		mode?: "payment" | "subscription";
		success_url: string;
		cancel_url: string;
	}): Promise<StripeCheckoutSession> {
		return this.request<StripeCheckoutSession>("/checkout/sessions", {
			"line_items[]": params.line_items,
			mode: params.mode ?? "payment",
			success_url: params.success_url,
			cancel_url: params.cancel_url,
		});
	}

	async getSession(id: string): Promise<StripeCheckoutSession> {
		return this.request<StripeCheckoutSession>(`/checkout/sessions/${id}`);
	}

	async createPaymentIntent(params: {
		amount: number;
		currency: string;
		metadata?: Record<string, string>;
	}): Promise<StripePaymentIntent> {
		return this.request<StripePaymentIntent>("/payment_intents", {
			amount: params.amount,
			currency: params.currency,
			metadata: params.metadata,
		});
	}
}

export const createStripeClient = (config: StripeConfig): StripeClientPort => {
	if (!config.secretKey) {
		throw new Error("Stripe secret key is required");
	}
	return new StripeRestAdapter(config);
};
