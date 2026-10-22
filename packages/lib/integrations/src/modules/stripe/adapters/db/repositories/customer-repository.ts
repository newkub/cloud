// ============================================================================
// Infrastructure - Customer Repository (Pure Functions)
// ============================================================================

import { and, eq, isNull, like } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { CustomerFilters } from "#modules/customer/types";
import type { Result } from "#shared/types/result-either";
import { failure, success } from "#shared/types/result-helpers";
import { getDb } from "../connection";
import type { CustomerSchema, NewCustomerSchema } from "./schema/customers";
import { customers } from "./schema/customers";

// ============================================================================
// Database Connection Helper
// ============================================================================

function getDbConnection(): PostgresJsDatabase {
	return getDb() as unknown as PostgresJsDatabase;
}

// ============================================================================
// Customer Repository Functions
// ============================================================================

export async function create(
	data: Omit<NewCustomerSchema, "id" | "createdAt" | "updatedAt">,
	now: number = Date.now(),
): Promise<Result<CustomerSchema>> {
	try {
		const db = getDbConnection();
		const [customer] = await db
			.insert(customers)
			.values({
				...data,
				createdAt: new Date(now),
				updatedAt: new Date(now),
			})
			.returning();
		return success(customer);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findById(
	id: number,
): Promise<Result<CustomerSchema | null>> {
	try {
		const db = getDbConnection();
		const [customer] = await db
			.select()
			.from(customers)
			.where(and(eq(customers.id, id), isNull(customers.deletedAt)))
			.limit(1);
		return success(customer ?? null);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findByStripeCustomerId(
	stripeCustomerId: string,
): Promise<Result<CustomerSchema | null>> {
	try {
		const db = getDbConnection();
		const [customer] = await db
			.select()
			.from(customers)
			.where(
				and(
					eq(customers.stripeCustomerId, stripeCustomerId),
					isNull(customers.deletedAt),
				),
			)
			.limit(1);
		return success(customer ?? null);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findByEmail(
	email: string,
): Promise<Result<CustomerSchema | null>> {
	try {
		const db = getDbConnection();
		const [customer] = await db
			.select()
			.from(customers)
			.where(and(eq(customers.email, email), isNull(customers.deletedAt)))
			.limit(1);
		return success(customer ?? null);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findAll(
	filters?: CustomerFilters,
): Promise<Result<CustomerSchema[]>> {
	try {
		const db = getDbConnection();
		const conditions = [isNull(customers.deletedAt)];

		if (filters?.email) {
			conditions.push(eq(customers.email, filters.email));
		}

		if (filters?.name) {
			conditions.push(like(customers.name, `%${filters.name}%`));
		}

		const limit = filters?.limit ?? 100;
		const offset = filters?.offset ?? 0;

		const customersList = await db
			.select()
			.from(customers)
			.where(and(...conditions))
			.limit(limit)
			.offset(offset);
		return success(customersList);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function update(
	id: number,
	data: Partial<NewCustomerSchema>,
	now: number = Date.now(),
): Promise<Result<CustomerSchema>> {
	try {
		const db = getDbConnection();
		const [customer] = await db
			.update(customers)
			.set({ ...data, updatedAt: new Date(now) })
			.where(eq(customers.id, id))
			.returning();
		return success(customer);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function deleteCustomer(
	id: number,
	now: number = Date.now(),
): Promise<Result<void>> {
	try {
		const db = getDbConnection();
		await db
			.update(customers)
			.set({ deletedAt: new Date(now), updatedAt: new Date(now) })
			.where(eq(customers.id, id));
		return success(undefined);
	} catch (error) {
		return failure(error as Error);
	}
}

// ============================================================================
// Customer Repository (Exported Object)
// ============================================================================

export const customerRepository = {
	create,
	findById,
	findByStripeCustomerId,
	findByEmail,
	findAll,
	update,
	delete: deleteCustomer,
};
