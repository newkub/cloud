import { CreateNotification } from "#application/usecases/create-notification";
import type { CreateNotificationInput } from "#domain/entities/notification";
import type { NotificationRepository } from "#domain/repositories/notification-repository";

interface McpRequest {
	method?: string;
	params?: {
		name?: string;
		arguments?: Record<string, unknown>;
	};
}

export function mcpRoute(repository: NotificationRepository) {
	return ({ body }: { body: unknown }) => {
		const request = body as McpRequest;

		if (request.method === "tools/list") {
			return {
				tools: [
					{
						name: "create_notification",
						description: "Create a notification",
						inputSchema: {
							type: "object",
							properties: {
								id: { type: "string" },
								title: { type: "string" },
								body: { type: "string" },
								channel: { type: "string" },
								createdAt: { type: "string", format: "date-time" },
							},
							required: ["id", "title", "body", "createdAt"],
						},
					},
					{ name: "list_notifications", description: "List all notifications" },
				],
			};
		}

		if (request.method === "tools/call") {
			const { name, arguments: args } = request.params ?? {};
			if (name === "create_notification") {
				const input = {
					...(args ?? {}),
					createdAt: new Date(String(args?.createdAt ?? "")),
				} as CreateNotificationInput;
				const notification = new CreateNotification(repository).execute(input);
				return {
					content: [{ type: "text", text: JSON.stringify(notification) }],
				};
			}
			if (name === "list_notifications") {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(repository.listNotifications()),
						},
					],
				};
			}
		}

		return { error: { code: -32601, message: "method not found" } };
	};
}
