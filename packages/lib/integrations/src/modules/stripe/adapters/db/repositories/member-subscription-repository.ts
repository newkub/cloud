// ============================================================================
// Infrastructure - Member Subscription Repository Implementation
// ============================================================================

import { and, desc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { MemberSubscriptionRepository } from "#modules/subscription/ports/subscription-repository";
import type {
	MemberSubscription,
	SubscribeCustomerRequest,
	SubscriptionFilters,
} from "#modules/subscription/types";
import { getDb } from "../connection";
import { memberSubscriptions } from "./schema/member-subscriptions";

export class DrizzleMemberSubscriptionRepository
	implements MemberSubscriptionRepository
{
	private db: PostgresJsDatabase;

	constructor() {
		this.db = getDb() as unknown as PostgresJsDatabase;
	}

	async createSubscription(
		request: SubscribeCustomerRequest,
		randomUUID: () => string = (
			randomUUID: () => string = () => crypto.randomUUID(),
		) => randomUUID(),
		now: number = Date.now(),
	): Promise<MemberSubscription> {
		const [subscription] = await this.db
			.insert(memberSubscriptions)
			.values({
				customerId: request.customerId,
				planId: request.planId,
				stripeSubscriptionId: request.stripeSubscriptionId || randomUUID(),
				status: request.status || "active",
				currentPeriodStart: request.currentPeriodStart || new Date(now),
				currentPeriodEnd: request.currentPeriodEnd || new Date(now),
				trialStart: request.trialStart,
				trialEnd: request.trialEnd,
				cancelAtPeriodEnd: false,
				metadata: request.metadata ? JSON.stringify(request.metadata) : null,
			})
			.returning();

		return this.mapToDomain(subscription);
	}

	async updateSubscription(
		id: string,
		data: Partial<MemberSubscription>,
		now: number = Date.now(),
	): Promise<MemberSubscription> {
		const updateData: Record<string, unknown> = {
			updatedAt: new Date(now),
		};

		if (data.status !== undefined) {
			updateData.status = data.status;
		}
		if (data.currentPeriodStart !== undefined) {
			updateData.currentPeriodStart = data.currentPeriodStart;
		}
		if (data.currentPeriodEnd !== undefined) {
			updateData.currentPeriodEnd = data.currentPeriodEnd;
		}
		if (data.trialStart !== undefined) {
			updateData.trialStart = data.trialStart;
		}
		if (data.trialEnd !== undefined) {
			updateData.trialEnd = data.trialEnd;
		}
		if (data.cancelAtPeriodEnd !== undefined) {
			updateData.cancelAtPeriodEnd = data.cancelAtPeriodEnd;
		}
		if (data.cancelledAt !== undefined) {
			updateData.cancelledAt = data.cancelledAt;
		}
		if (data.pausedAt !== undefined) {
			updateData.pausedAt = data.pausedAt;
		}
		if (data.resumedAt !== undefined) {
			updateData.resumedAt = data.resumedAt;
		}
		if (data.metadata !== undefined) {
			updateData.metadata = JSON.stringify(data.metadata);
		}

		const [subscription] = await this.db
			.update(memberSubscriptions)
			.set(updateData)
			.where(eq(memberSubscriptions.id, Number.parseInt(id, 10)))
			.returning();

		if (!subscription) {
			throw new Error(`Subscription with id ${id} not found`);
		}

		return this.mapToDomain(subscription);
	}

	async deleteSubscription(id: string): Promise<void> {
		await this.db
			.delete(memberSubscriptions)
			.where(eq(memberSubscriptions.id, Number.parseInt(id, 10)));
	}

	async getSubscription(id: string): Promise<MemberSubscription | null> {
		const [subscription] = await this.db
			.select()
			.from(memberSubscriptions)
			.where(eq(memberSubscriptions.id, Number.parseInt(id, 10)))
			.limit(1);

		return subscription ? this.mapToDomain(subscription) : null;
	}

	async getSubscriptionsByCustomer(
		customerId: string,
	): Promise<readonly MemberSubscription[]> {
		const subscriptions = await this.db
			.select()
			.from(memberSubscriptions)
			.where(eq(memberSubscriptions.customerId, customerId))
			.orderBy(desc(memberSubscriptions.createdAt));

		return subscriptions.map((sub) => this.mapToDomain(sub));
	}

	async getSubscriptionsByPlan(
		planId: string,
	): Promise<readonly MemberSubscription[]> {
		const subscriptions = await this.db
			.select()
			.from(memberSubscriptions)
			.where(eq(memberSubscriptions.planId, planId))
			.orderBy(desc(memberSubscriptions.createdAt));

		return subscriptions.map((sub) => this.mapToDomain(sub));
	}

	async getActiveSubscriptions(): Promise<readonly MemberSubscription[]> {
		const subscriptions = await this.db
			.select()
			.from(memberSubscriptions)
			.where(eq(memberSubscriptions.status, "active"))
			.orderBy(desc(memberSubscriptions.createdAt));

		return subscriptions.map((sub) => this.mapToDomain(sub));
	}

	async getSubscriptionsWithFilters(
		filters: SubscriptionFilters,
	): Promise<readonly MemberSubscription[]> {
		const conditions = [];

		if (filters.customerId) {
			conditions.push(eq(memberSubscriptions.customerId, filters.customerId));
		}
		if (filters.planId) {
			conditions.push(eq(memberSubscriptions.planId, filters.planId));
		}
		if (filters.status) {
			conditions.push(eq(memberSubscriptions.status, filters.status));
		}
		if (filters.stripeSubscriptionId) {
			conditions.push(
				eq(
					memberSubscriptions.stripeSubscriptionId,
					filters.stripeSubscriptionId,
				),
			);
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const subscriptions = await this.db
			.select()
			.from(memberSubscriptions)
			.where(whereClause)
			.orderBy(desc(memberSubscriptions.createdAt));

		return subscriptions.map((sub) => this.mapToDomain(sub));
	}

	async getAllSubscriptions(): Promise<readonly MemberSubscription[]> {
		const subscriptions = await this.db
			.select()
			.from(memberSubscriptions)
			.orderBy(desc(memberSubscriptions.createdAt));

		return subscriptions.map((sub) => this.mapToDomain(sub));
	}

	private mapToDomain(
		schema: typeof memberSubscriptions.$inferSelect,
	): MemberSubscription {
		return {
			id: schema.id.toString(),
			customerId: schema.customerId,
			planId: schema.planId,
			stripeSubscriptionId: schema.stripeSubscriptionId,
			status: schema.status as
				| "active"
				| "paused"
				| "cancelled"
				| "past_due"
				| "trialing",
			currentPeriodStart: schema.currentPeriodStart
				? schema.currentPeriodStart.toISOString()
				: "",
			currentPeriodEnd: schema.currentPeriodEnd
				? schema.currentPeriodEnd.toISOString()
				: "",
			trialStart: schema.trialStart
				? schema.trialStart.toISOString()
				: undefined,
			trialEnd: schema.trialEnd ? schema.trialEnd.toISOString() : undefined,
			cancelAtPeriodEnd: schema.cancelAtPeriodEnd,
			cancelledAt: schema.cancelledAt
				? schema.cancelledAt.toISOString()
				: undefined,
			pausedAt: schema.pausedAt ? schema.pausedAt.toISOString() : undefined,
			resumedAt: schema.resumedAt ? schema.resumedAt.toISOString() : undefined,
			metadata: schema.metadata ? JSON.parse(schema.metadata) : undefined,
			createdAt: schema.createdAt ? schema.createdAt.toISOString() : "",
			updatedAt: schema.updatedAt ? schema.updatedAt.toISOString() : "",
		};
	}
}
