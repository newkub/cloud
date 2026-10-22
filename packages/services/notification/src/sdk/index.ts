import type {
	CreateNotificationInput,
	Notification,
} from "#domain/entities/notification";
import type {
	CreateSubscriberInput,
	Subscriber,
} from "#domain/entities/subscriber";

export class NotificationClient {
	constructor(private baseUrl: string) {}

	async getHealth(): Promise<{ status: string }> {
		const res = await fetch(`${this.baseUrl}/health`);
		if (!res.ok) throw new Error(`health check failed: ${res.status}`);
		return res.json();
	}

	async createNotification(
		input: CreateNotificationInput,
	): Promise<Notification> {
		const res = await fetch(`${this.baseUrl}/api/notifications`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(input),
		});
		if (!res.ok) throw new Error(`create notification failed: ${res.status}`);
		return res.json();
	}

	async listNotifications(): Promise<Notification[]> {
		const res = await fetch(`${this.baseUrl}/api/notifications`);
		if (!res.ok) throw new Error(`list notifications failed: ${res.status}`);
		return res.json();
	}

	async createSubscriber(input: CreateSubscriberInput): Promise<Subscriber> {
		const res = await fetch(`${this.baseUrl}/api/subscribers`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(input),
		});
		if (!res.ok) throw new Error(`create subscriber failed: ${res.status}`);
		return res.json();
	}

	async listSubscribers(): Promise<Subscriber[]> {
		const res = await fetch(`${this.baseUrl}/api/subscribers`);
		if (!res.ok) throw new Error(`list subscribers failed: ${res.status}`);
		return res.json();
	}

	async trigger(
		notificationId: string,
		subscriberId: string,
	): Promise<{ success: boolean; message: string }> {
		const res = await fetch(`${this.baseUrl}/api/trigger`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ notificationId, subscriberId }),
		});
		if (!res.ok) throw new Error(`trigger failed: ${res.status}`);
		return res.json();
	}
}
