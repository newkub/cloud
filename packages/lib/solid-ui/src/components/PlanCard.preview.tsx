/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { PlanCard } from "./PlanCard";

export const preview = (): JSX.Element => (
	<PlanCard
		billing="yearly"
		plan={{
			name: "Pro",
			description: "For growing teams",
			price: 19,
			yearly: 190,
			popular: true,
			features: ["Unlimited projects", "Priority support", "Advanced analytics", "SSO"],
			cta: "Start free trial",
		}}
	/>
);
