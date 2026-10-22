import type {
	CreateNotificationInput,
	Notification,
} from "#domain/entities/notification";
import type {
	CreateSubscriberInput,
	Subscriber,
} from "#domain/entities/subscriber";

export interface NotificationRepository {
	createNotification(input: CreateNotificationInput): Notification;
	listNotifications(): Notification[];
	createSubscriber(input: CreateSubscriberInput): Subscriber;
	listSubscribers(): Subscriber[];
	trigger(
		notificationId: string,
		subscriberId: string,
	): { success: boolean; message: string };
}
