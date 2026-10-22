// ============================================================================
// Cloudflare Integration — REST adapter over the Cloudflare API
// ============================================================================

export interface CloudflareConfig {
	token: string;
	accountId?: string;
}

export interface CloudflareZone {
	id: string;
	name: string;
}

export interface CloudflareClientPort {
	listZones(): Promise<CloudflareZone[]>;
	getZone(id: string): Promise<CloudflareZone>;
}

class CloudflareRestAdapter implements CloudflareClientPort {
	private readonly token: string;

	constructor(config: CloudflareConfig) {
		this.token = config.token;
	}

	async listZones(): Promise<CloudflareZone[]> {
		const res = await fetch("https://api.cloudflare.com/client/v4/zones", {
			headers: {
				Authorization: `Bearer ${this.token}`,
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`Cloudflare API error: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as { result: CloudflareZone[] };
		return data.result;
	}

	async getZone(id: string): Promise<CloudflareZone> {
		const res = await fetch(
			`https://api.cloudflare.com/client/v4/zones/${id}`,
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					Accept: "application/json",
				},
			},
		);

		if (!res.ok) {
			throw new Error(`Cloudflare API error: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as { result: CloudflareZone };
		return data.result;
	}
}

export const createCloudflareClient = (
	config: CloudflareConfig,
): CloudflareClientPort => {
	if (!config.token) {
		throw new Error("Cloudflare token is required");
	}
	return new CloudflareRestAdapter(config);
};
