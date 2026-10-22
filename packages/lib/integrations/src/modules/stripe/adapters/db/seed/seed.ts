// ============================================================================
// Infrastructure - Seed Script
// ============================================================================

import { getDb } from "../connection";
import { memberSubscriptions, subscriptionPlans } from "../repositories/schema";

export async function seedDatabase(now: number = Date.now()) {
	const db = getDb();

	console.log("🌱 Starting database seed...");

	// Seed subscription plans
	console.log("📦 Seeding subscription plans...");
	await db.insert(subscriptionPlans).values([
		{
			organizationId: "org_001",
			name: "Starter Plan",
			description: "Perfect for individuals and small projects",
			price: "9.99",
			currency: "usd",
			billingInterval: "monthly",
			trialDays: 14,
			isActive: true,
			isPublic: true,
			benefits: ["Up to 5 projects", "Basic support", "1GB storage"],
		},
		{
			organizationId: "org_001",
			name: "Pro Plan",
			description: "For growing teams and businesses",
			price: "29.99",
			currency: "usd",
			billingInterval: "monthly",
			trialDays: 14,
			isActive: true,
			isPublic: true,
			benefits: [
				"Unlimited projects",
				"Priority support",
				"10GB storage",
				"Advanced analytics",
			],
		},
		{
			organizationId: "org_001",
			name: "Enterprise Plan",
			description: "For large organizations with custom needs",
			price: "99.99",
			currency: "usd",
			billingInterval: "monthly",
			trialDays: 30,
			isActive: true,
			isPublic: true,
			benefits: [
				"Unlimited everything",
				"24/7 dedicated support",
				"Unlimited storage",
				"Custom integrations",
				"SLA guarantee",
			],
		},
		{
			organizationId: "org_001",
			name: "Annual Starter",
			description: "Starter plan with annual billing discount",
			price: "99.99",
			currency: "usd",
			billingInterval: "yearly",
			trialDays: 14,
			isActive: true,
			isPublic: true,
			benefits: [
				"Up to 5 projects",
				"Basic support",
				"1GB storage",
				"2 months free",
			],
		},
	]);

	console.log("✅ Subscription plans seeded successfully");

	// Seed member subscriptions
	console.log("👥 Seeding member subscriptions...");
	await db.insert(memberSubscriptions).values([
		{
			customerId: "cus_001",
			planId: "1",
			stripeSubscriptionId: "sub_001",
			status: "active",
			currentPeriodStart: new Date(now),
			currentPeriodEnd: new Date(now + 30 * 24 * 60 * 60 * 1000), // 30 days from now
			cancelAtPeriodEnd: false,
			metadata: JSON.stringify({ source: "seed_script" }),
		},
		{
			customerId: "cus_002",
			planId: "2",
			stripeSubscriptionId: "sub_002",
			status: "trialing",
			currentPeriodStart: new Date(now),
			currentPeriodEnd: new Date(now + 30 * 24 * 60 * 60 * 1000),
			trialStart: new Date(now),
			trialEnd: new Date(now + 14 * 24 * 60 * 60 * 1000), // 14 days trial
			cancelAtPeriodEnd: false,
			metadata: JSON.stringify({ source: "seed_script" }),
		},
		{
			customerId: "cus_003",
			planId: "3",
			stripeSubscriptionId: "sub_003",
			status: "paused",
			currentPeriodStart: new Date(now - 60 * 24 * 60 * 60 * 1000),
			currentPeriodEnd: new Date(now - 30 * 24 * 60 * 60 * 1000),
			pausedAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
			cancelAtPeriodEnd: false,
			metadata: JSON.stringify({ source: "seed_script" }),
		},
	]);

	console.log("✅ Member subscriptions seeded successfully");
	console.log("🎉 Database seed completed!");
}

// Run seed if executed directly
if (import.meta.main) {
	seedDatabase()
		.then(() => {
			console.log("✨ Seed completed successfully");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ Seed failed:", error);
			process.exit(1);
		});
}
