import type {
	CreateNotificationInput,
	Notification,
} from "#domain/entities/notification";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

export class CreateNotification {
	constructor(private repository: NotificationRepository) {}

	execute(input: CreateNotificationInput): Notification {
		return this.repository.createNotification(input);
	}
}
