import type {
	CreateSubscriberInput,
	Subscriber,
} from "#domain/entities/subscriber";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

export class CreateSubscriber {
	constructor(private repository: NotificationRepository) {}

	execute(input: CreateSubscriberInput): Subscriber {
		return this.repository.createSubscriber(input);
	}
}
