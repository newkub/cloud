import { NotificationClient } from "#sdk/index";

export function createSkillClient(baseUrl: string) {
	return new NotificationClient(baseUrl);
}
