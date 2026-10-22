import type { NotificationRepository } from "#domain/repositories/notification-repository";

export class TriggerNotification {
	constructor(private repository: NotificationRepository) {}

	execute(
		notificationId: string,
		subscriberId: string,
	): { success: boolean; message: string } {
		return this.repository.trigger(notificationId, subscriberId);
	}
}
