// ============================================================================
// Adapters - Config - Environment Configuration
// ============================================================================

export interface EnvConfig {
	databaseUrl: string;
	stripePublishableKey: string;
	stripeSecretKey: string;
	stripeWebhookSecret: string;
	stripeApiVersion: string;
	stripeCurrency: string;
	stripeLocale: string;
}

export function getEnvConfig(): EnvConfig {
	const databaseUrl = process.env.DATABASE_URL;
	const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
	const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
	const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL environment variable is not set. Please set it in your .env file.",
		);
	}

	if (!stripePublishableKey) {
		throw new Error(
			"STRIPE_PUBLISHABLE_KEY environment variable is not set. Please set it in your .env file.",
		);
	}

	if (!stripeSecretKey) {
		throw new Error(
			"STRIPE_SECRET_KEY environment variable is not set. Please set it in your .env file.",
		);
	}

	if (!stripeWebhookSecret) {
		throw new Error(
			"STRIPE_WEBHOOK_SECRET environment variable is not set. Please set it in your .env file.",
		);
	}

	return {
		databaseUrl,
		stripePublishableKey,
		stripeSecretKey,
		stripeWebhookSecret,
		stripeApiVersion: process.env.STRIPE_API_VERSION || "2024-12-18.acacia",
		stripeCurrency: process.env.STRIPE_CURRENCY || "usd",
		stripeLocale: process.env.STRIPE_LOCALE || "en",
	};
}
