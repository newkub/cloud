import type { Subscriber } from "#domain/entities/subscriber";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

export class ListSubscribers {
	constructor(private repository: NotificationRepository) {}

	execute(): Subscriber[] {
		return this.repository.listSubscribers();
	}
}
