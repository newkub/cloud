import { Elysia, t } from "elysia";
import { SqliteStore } from "#adapters/db/sqlite-store";
import { mcpRoute } from "#adapters/mcp/index";
import { CreateNotification } from "#application/usecases/create-notification";
import { CreateSubscriber } from "#application/usecases/create-subscriber";
import { ListNotifications } from "#application/usecases/list-notifications";
import { ListSubscribers } from "#application/usecases/list-subscribers";
import { TriggerNotification } from "#application/usecases/trigger-notification";
import type { NotificationRepository } from "#domain/repositories/notification-repository";
import { dashboardHtml } from "#presentation/web/dashboard";

export const createServer = (
	repository: NotificationRepository = new SqliteStore(),
) => {
	return new Elysia()
		.get("/", () => dashboardHtml)
		.get("/health", () => ({ status: "ok", service: "notification" }))
		.get("/api/notifications", () =>
			new ListNotifications(repository).execute(),
		)
		.post(
			"/api/notifications",
			({ body }) =>
				new CreateNotification(repository).execute({
					...body,
					createdAt: new Date(body.createdAt),
				}),
			{
				body: t.Object({
					id: t.String(),
					title: t.String(),
					body: t.String(),
					channel: t.Optional(
						t.Union([
							t.Literal("in-app"),
							t.Literal("email"),
							t.Literal("sms"),
							t.Literal("push"),
						]),
					),
					createdAt: t.String({ format: "date-time" }),
				}),
			},
		)
		.get("/api/subscribers", () => new ListSubscribers(repository).execute())
		.post(
			"/api/subscribers",
			({ body }) =>
				new CreateSubscriber(repository).execute({
					...body,
					createdAt: new Date(body.createdAt),
				}),
			{
				body: t.Object({
					id: t.String(),
					email: t.String({ format: "email" }),
					name: t.Optional(t.String()),
					channels: t.Optional(
						t.Array(
							t.Union([
								t.Literal("in-app"),
								t.Literal("email"),
								t.Literal("sms"),
								t.Literal("push"),
							]),
						),
					),
					createdAt: t.String({ format: "date-time" }),
				}),
			},
		)
		.post(
			"/api/trigger",
			({ body }) =>
				new TriggerNotification(repository).execute(
					body.notificationId,
					body.subscriberId,
				),
			{
				body: t.Object({
					notificationId: t.String(),
					subscriberId: t.String(),
				}),
			},
		)
		.post("/mcp", mcpRoute(repository));
};
