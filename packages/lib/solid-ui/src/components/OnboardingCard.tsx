/**
 * OnboardingCard — feature-intro card with steps, dots, skip/next.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface OnboardingStep {
	title: string;
	description: string;
	/** Illustration slot. */
	media?: JSX.Element;
}

export interface OnboardingCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps: OnboardingStep[];
	/** Controlled step index. */
	currentStep?: number;
	onStepChange?: (index: number) => void;
	onComplete?: () => void;
	onSkip?: () => void;
	labels?: { back?: string; next?: string; done?: string; skip?: string };
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-4", md: "p-6", lg: "p-8" } as const;
const titleSize = { sm: "text-base", md: "text-lg", lg: "text-xl" } as const;

export function OnboardingCard(props: OnboardingCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"steps",
		"currentStep",
		"onStepChange",
		"onComplete",
		"onSkip",
		"labels",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [internal, setInternal] = createSignal(0);
	const steps = () => local.steps ?? [];
	const step = () => Math.min(local.currentStep ?? internal(), steps().length - 1);
	const last = () => step() === steps().length - 1;
	const labels = () => ({ back: "Back", next: "Next", done: "Get started", skip: "Skip", ...local.labels });
	const go = (dir: 1 | -1) => {
		if (dir === 1 && last()) {
			local.onComplete?.();
			return;
		}
		const next = step() + dir;
		setInternal(next);
		local.onStepChange?.(next);
	};

	return (
		<div
			class={`solidui-onboarding-card ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={steps()[step()]?.media}>
				<div class="mb-4 flex justify-center">{steps()[step()]?.media}</div>
			</Show>
			<h3 class={`text-center font-semibold text-foreground ${titleSize[local.size ?? "md"]}`}>
				{steps()[step()]?.title}
			</h3>
			<p class={`mt-2 text-center text-muted-foreground ${local.size === "lg" ? "text-sm" : "text-xs"}`}>
				{steps()[step()]?.description}
			</p>
			<div class="mt-5 flex justify-center gap-1.5" aria-hidden="true">
				<For each={steps()}>
					{(_, i) => (
						<span
							class={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${i() === step() ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
						/>
					)}
				</For>
			</div>
			<div class="mt-4 flex items-center justify-between">
				<button
					type="button"
					class="h-8 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => (step() === 0 ? local.onSkip?.() : go(-1))}
				>
					{step() === 0 ? labels().skip : labels().back}
				</button>
				<button
					type="button"
					class="h-8 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => go(1)}
				>
					{last() ? labels().done : labels().next}
				</button>
			</div>
		</div>
	);
}
