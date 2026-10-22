export interface Notification {
	id: string;
	title: string;
	body: string;
	channel: "in-app" | "email" | "sms" | "push";
	createdAt: Date;
}

export interface CreateNotificationInput {
	id: string;
	title: string;
	body: string;
	channel?: Notification["channel"];
	createdAt: Date;
}
