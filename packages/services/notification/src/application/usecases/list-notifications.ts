import type { Notification } from "#domain/entities/notification";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

export class ListNotifications {
	constructor(private repository: NotificationRepository) {}

	execute(): Notification[] {
		return this.repository.listNotifications();
	}
}
