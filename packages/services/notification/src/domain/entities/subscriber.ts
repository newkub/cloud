export interface Subscriber {
	id: string;
	email: string;
	name?: string;
	channels: Array<"in-app" | "email" | "sms" | "push">;
	createdAt: Date;
}

export interface CreateSubscriberInput {
	id: string;
	email: string;
	name?: string;
	channels?: Subscriber["channels"];
	createdAt: Date;
}
