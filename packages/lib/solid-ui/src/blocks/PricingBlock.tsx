import { For, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";

export interface PricingTier {
	name: string;
	price: string;
	period?: string;
	features: string[];
	featured?: boolean;
	cta?: string;
}

export interface PricingBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	tiers: PricingTier[];
	onChoose?: (tier: PricingTier) => void;
}

/** Composed pricing section — tier cards with feature lists and CTAs. */
export function PricingBlock(props: PricingBlockProps) {
	return (
		<div class={props.class}>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<For each={props.tiers}>
					{(tier) => (
						<Card class={tier.featured ? "border-primary shadow-md" : undefined}>
							<CardHeader>
								<div class="flex items-center justify-between">
									<h3 class="text-base font-semibold">{tier.name}</h3>
									{tier.featured && <Badge variant="primary">Popular</Badge>}
								</div>
								<p class="mt-2">
									<span class="text-3xl font-bold">{tier.price}</span>
									{tier.period && <span class="text-sm text-muted-foreground">/{tier.period}</span>}
								</p>
							</CardHeader>
							<CardContent>
								<Divider class="mb-4" />
								<ul class="flex flex-col gap-2 text-sm">
									<For each={tier.features}>
										{(f) => (
											<li class="flex items-center gap-2">
												<span aria-hidden="true" class="text-primary">
													✓
												</span>
												{f}
											</li>
										)}
									</For>
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									variant={tier.featured ? "primary" : "secondary"}
									class="w-full"
									onClick={() => props.onChoose?.(tier)}
								>
									{tier.cta ?? "Choose"}
								</Button>
							</CardFooter>
						</Card>
					)}
				</For>
			</div>
		</div>
	);
}
