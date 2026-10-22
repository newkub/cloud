import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type {
	CreateNotificationInput,
	Notification,
} from "#domain/entities/notification";
import type {
	CreateSubscriberInput,
	Subscriber,
} from "#domain/entities/subscriber";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

const initSchema = `
CREATE TABLE IF NOT EXISTS notifications (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	body TEXT NOT NULL,
	channel TEXT NOT NULL,
	createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscribers (
	id TEXT PRIMARY KEY,
	email TEXT NOT NULL,
	name TEXT,
	channels TEXT NOT NULL,
	createdAt TEXT NOT NULL
);
`;

export class SqliteStore implements NotificationRepository {
	private readonly db: Database;

	constructor(
		dbPath = process.env.NOTIFICATION_DB_PATH ?? ".data/notifications.sqlite",
	) {
		mkdirSync(dirname(dbPath), { recursive: true });
		this.db = new Database(dbPath, { create: true });
		this.db.exec(initSchema);
	}

	createNotification(input: CreateNotificationInput): Notification {
		const notification: Notification = {
			id: input.id,
			title: input.title,
			body: input.body,
			channel: input.channel ?? "in-app",
			createdAt: input.createdAt,
		};

		this.db.run(
			"INSERT INTO notifications (id, title, body, channel, createdAt) VALUES (?, ?, ?, ?, ?)",
			[
				notification.id,
				notification.title,
				notification.body,
				notification.channel,
				notification.createdAt.toISOString(),
			],
		);

		return notification;
	}

	listNotifications(): Notification[] {
		const rows = this.db
			.query("SELECT * FROM notifications ORDER BY createdAt DESC")
			.all() as {
			id: string;
			title: string;
			body: string;
			channel: string;
			createdAt: string;
		}[];

		return rows.map((row) => ({
			id: row.id,
			title: row.title,
			body: row.body,
			channel: row.channel as Notification["channel"],
			createdAt: new Date(row.createdAt),
		}));
	}

	createSubscriber(input: CreateSubscriberInput): Subscriber {
		const subscriber: Subscriber = {
			id: input.id,
			email: input.email,
			name: input.name,
			channels: input.channels ?? ["in-app"],
			createdAt: input.createdAt,
		};

		this.db.run(
			"INSERT INTO subscribers (id, email, name, channels, createdAt) VALUES (?, ?, ?, ?, ?)",
			[
				subscriber.id,
				subscriber.email,
				subscriber.name ?? null,
				JSON.stringify(subscriber.channels),
				subscriber.createdAt.toISOString(),
			],
		);

		return subscriber;
	}

	listSubscribers(): Subscriber[] {
		const rows = this.db
			.query("SELECT * FROM subscribers ORDER BY createdAt DESC")
			.all() as {
			id: string;
			email: string;
			name?: string;
			channels: string;
			createdAt: string;
		}[];

		return rows.map((row) => ({
			...row,
			channels: JSON.parse(row.channels) as Subscriber["channels"],
			createdAt: new Date(row.createdAt),
		}));
	}

	trigger(
		notificationId: string,
		subscriberId: string,
	): { success: boolean; message: string } {
		const notificationRow = this.db
			.query("SELECT * FROM notifications WHERE id = ?")
			.get(notificationId) as
			| {
					id: string;
					title: string;
					body: string;
					channel: string;
					createdAt: string;
			  }
			| undefined;

		if (!notificationRow) {
			return { success: false, message: "notification not found" };
		}

		const subscriberRow = this.db
			.query("SELECT * FROM subscribers WHERE id = ?")
			.get(subscriberId) as
			| {
					id: string;
					email: string;
					name?: string;
					channels: string;
					createdAt: string;
			  }
			| undefined;

		if (!subscriberRow) {
			return { success: false, message: "subscriber not found" };
		}

		const channels = JSON.parse(
			subscriberRow.channels,
		) as Subscriber["channels"];
		if (
			!channels.includes(notificationRow.channel as Notification["channel"])
		) {
			return {
				success: false,
				message: `subscriber cannot receive ${notificationRow.channel}`,
			};
		}

		return {
			success: true,
			message: `sent ${notificationRow.title} to ${subscriberRow.email}`,
		};
	}
}
