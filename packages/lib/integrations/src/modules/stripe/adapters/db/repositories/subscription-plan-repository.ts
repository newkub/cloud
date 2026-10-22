// ============================================================================
// Infrastructure - Subscription Plan Repository Implementation
// ============================================================================

import { and, desc, eq, isNull } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { SubscriptionPlanRepository } from "#modules/subscription/ports/subscription-repository";
import type {
	CreatePlanRequest,
	SubscriptionPlan,
	UpdatePlanRequest,
} from "#modules/subscription/types";
import { getDb } from "../connection";
import { subscriptionPlans } from "./schema/subscription-plans";

export class DrizzleSubscriptionPlanRepository
	implements SubscriptionPlanRepository
{
	private db: PostgresJsDatabase;

	constructor() {
		this.db = getDb() as unknown as PostgresJsDatabase;
	}

	async createPlan(request: CreatePlanRequest): Promise<SubscriptionPlan> {
		const [plan] = await this.db
			.insert(subscriptionPlans)
			.values({
				organizationId: request.organizationId,
				name: request.name,
				description: request.description,
				price: request.price.toString(),
				currency: request.currency || "usd",
				billingInterval: request.billingInterval || request.interval,
				trialDays: request.trialDays || 0,
				isActive: true,
				isPublic: request.isPublic || false,
				benefits: (request.benefits || request.features) as string[],
			})
			.returning();

		return this.mapToDomain(plan);
	}

	async updatePlan(
		id: string,
		request: UpdatePlanRequest,
		now: number = Date.now(),
	): Promise<SubscriptionPlan> {
		const [plan] = await this.db
			.update(subscriptionPlans)
			.set({
				name: request.name,
				description: request.description,
				price: request.price?.toString(),
				currency: request.currency,
				billingInterval: request.billingInterval,
				trialDays: request.trialDays,
				isActive: request.isActive,
				isPublic: request.isPublic,
				benefits: (request.benefits || request.features) as string[],
				updatedAt: new Date(now),
			})
			.where(eq(subscriptionPlans.id, Number.parseInt(id, 10)))
			.returning();

		if (!plan) {
			throw new Error(`Plan with id ${id} not found`);
		}

		return this.mapToDomain(plan);
	}

	async deletePlan(id: string, now: number = Date.now()): Promise<void> {
		await this.db
			.update(subscriptionPlans)
			.set({ deletedAt: new Date(now) })
			.where(eq(subscriptionPlans.id, Number.parseInt(id, 10)));
	}

	async getPlan(id: string): Promise<SubscriptionPlan | null> {
		const [plan] = await this.db
			.select()
			.from(subscriptionPlans)
			.where(
				and(
					eq(subscriptionPlans.id, Number.parseInt(id, 10)),
					isNull(subscriptionPlans.deletedAt),
				),
			)
			.limit(1);

		return plan ? this.mapToDomain(plan) : null;
	}

	async getPlansByOrganization(
		organizationId: string,
	): Promise<readonly SubscriptionPlan[]> {
		const plans = await this.db
			.select()
			.from(subscriptionPlans)
			.where(
				and(
					eq(subscriptionPlans.organizationId, organizationId),
					isNull(subscriptionPlans.deletedAt),
				),
			)
			.orderBy(desc(subscriptionPlans.createdAt));

		return plans.map((plan) => this.mapToDomain(plan));
	}

	async getAllPlans(): Promise<readonly SubscriptionPlan[]> {
		const plans = await this.db
			.select()
			.from(subscriptionPlans)
			.where(isNull(subscriptionPlans.deletedAt))
			.orderBy(desc(subscriptionPlans.createdAt));

		return plans.map((plan) => this.mapToDomain(plan));
	}

	async getActivePlans(): Promise<readonly SubscriptionPlan[]> {
		const plans = await this.db
			.select()
			.from(subscriptionPlans)
			.where(
				and(
					eq(subscriptionPlans.isActive, true),
					isNull(subscriptionPlans.deletedAt),
				),
			)
			.orderBy(desc(subscriptionPlans.createdAt));

		return plans.map((plan) => this.mapToDomain(plan));
	}

	async getPublicPlans(): Promise<readonly SubscriptionPlan[]> {
		const plans = await this.db
			.select()
			.from(subscriptionPlans)
			.where(
				and(
					eq(subscriptionPlans.isPublic, true),
					eq(subscriptionPlans.isActive, true),
					isNull(subscriptionPlans.deletedAt),
				),
			)
			.orderBy(desc(subscriptionPlans.createdAt));

		return plans.map((plan) => this.mapToDomain(plan));
	}

	private mapToDomain(
		schema: typeof subscriptionPlans.$inferSelect,
	): SubscriptionPlan {
		return {
			id: schema.id.toString(),
			organizationId: schema.organizationId,
			name: schema.name,
			description: schema.description || undefined,
			price: Number.parseFloat(schema.price),
			currency: schema.currency,
			interval: schema.billingInterval as "monthly" | "yearly",
			intervalCount: 1,
			trialDays: schema.trialDays,
			features: (schema.benefits as string[]) || [],
			isActive: schema.isActive,
			isPublic: schema.isPublic,
			createdAt: schema.createdAt ? schema.createdAt.toISOString() : "",
			updatedAt: schema.updatedAt ? schema.updatedAt.toISOString() : "",
		};
	}
}
