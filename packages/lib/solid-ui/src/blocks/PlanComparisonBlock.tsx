import { createSignal, For, Show, type JSX } from "solid-js";
import { ComparisonTable, type ComparisonColumn, type ComparisonRow } from "../components/ComparisonTable";
import { PlanCard, type PricingPlan } from "../components/PlanCard";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";

export interface PlanComparisonBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	title?: string;
	description?: string;
	plans: PricingPlan[];
	/** Feature matrix rendered under the cards. */
	columns?: ComparisonColumn[];
	rows?: ComparisonRow[];
	currency?: string;
	onSelect?: (plan: PricingPlan) => void;
}

/** Plan cards with a billing switch and an optional feature matrix. */
export function PlanComparisonBlock(props: PlanComparisonBlockProps) {
	const [billing, setBilling] = createSignal<"monthly" | "yearly">("monthly");

	return (
		<div class={`flex flex-col gap-8 ${props.class ?? ""}`}>
			<div class="flex flex-col items-center gap-4 text-center">
				<Show when={props.title}>
					<h2 class="text-2xl font-semibold tracking-tight">{props.title}</h2>
				</Show>
				<Show when={props.description}>
					<p class="max-w-2xl text-sm text-muted-foreground">{props.description}</p>
				</Show>
				<Tabs
					value={billing()}
					onValueChange={(value) => setBilling(value === "yearly" ? "yearly" : "monthly")}
				>
					<TabsList variant="pills">
						<TabsTrigger value="monthly">Monthly</TabsTrigger>
						<TabsTrigger value="yearly">Yearly · save 20%</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<For each={props.plans}>
					{(plan) => (
						<PlanCard
							plan={plan}
							billing={billing()}
							currency={props.currency ?? "$"}
							onSelect={props.onSelect}
						/>
					)}
				</For>
			</div>
			<Show when={props.columns?.length && props.rows?.length}>
				<ComparisonTable columns={props.columns ?? []} rows={props.rows ?? []} />
			</Show>
		</div>
	);
}
