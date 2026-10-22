/**
 * WizardForm — multi-step form shell: step indicator + content + back/next controls.
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

export interface WizardStep {
	title: string;
	description?: string;
	content: JSX.Element;
	/** Gate "next" — return false to block advancing. */
	validate?: () => boolean | Promise<boolean>;
}

export interface WizardFormProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps: WizardStep[];
	/** Controlled current step index. */
	currentStep?: number;
	onStepChange?: (index: number) => void;
	onComplete?: () => void;
	/** Button labels. */
	labels?: { back?: string; next?: string; finish?: string };
	/** Clickable step indicators to jump back. @default true */
	clickableSteps?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-4", md: "p-6", lg: "p-8" } as const;

export function WizardForm(props: WizardFormProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"steps",
		"currentStep",
		"onStepChange",
		"onComplete",
		"labels",
		"clickableSteps",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [internal, setInternal] = createSignal(0);
	const steps = () => local.steps ?? [];
	const step = () => Math.min(local.currentStep ?? internal(), steps().length - 1);
	const last = () => step() === steps().length - 1;
	const labels = () => ({ back: "Back", next: "Next", finish: "Finish", ...local.labels });

	const go = async (dir: 1 | -1) => {
		if (dir === 1 && !last()) {
			const ok = await steps()[step()]?.validate?.();
			if (ok === false) return;
		}
		const next = step() + dir;
		if (dir === 1 && last()) {
			local.onComplete?.();
			return;
		}
		setInternal(next);
		local.onStepChange?.(next);
	};
	const jump = (i: number) => {
		if ((local.clickableSteps ?? true) && i < step()) {
			setInternal(i);
			local.onStepChange?.(i);
		}
	};

	return (
		<div
			class={`solidui-wizard-form ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<ol class={`flex items-center gap-2 border-b border-border ${pad[local.size ?? "md"]} pb-4`}>
				<For each={steps()}>
					{(s, i) => (
						<li class="flex items-center gap-2">
							<button
								type="button"
								disabled={i() > step()}
								class={`flex items-center gap-2 ${i() < step() && (local.clickableSteps ?? true) ? "cursor-pointer" : "cursor-default"} disabled:opacity-60`}
								aria-current={i() === step() ? "step" : undefined}
								onClick={() => jump(i())}
							>
								<span
									class={`flex h-6 w-6 items-center justify-center rounded-full text-2xs font-semibold ${
										i() < step()
											? "bg-primary text-primary-foreground"
											: i() === step()
												? "border-2 border-primary text-primary"
												: "border border-border text-muted-foreground"
									}`}
								>
									{i() < step() ? "✓" : i() + 1}
								</span>
								<span
									class={`hidden text-xs font-medium sm:inline ${i() === step() ? "text-foreground" : "text-muted-foreground"}`}
								>
									{s.title}
								</span>
							</button>
							<Show when={i() < steps().length - 1}>
								<span class="mx-1 h-px w-6 bg-border" aria-hidden="true" />
							</Show>
						</li>
					)}
				</For>
			</ol>
			<div class={pad[local.size ?? "md"]}>
				<Show when={steps()[step()]?.description}>
					<p class="mb-3 text-xs text-muted-foreground">{steps()[step()]?.description}</p>
				</Show>
				{steps()[step()]?.content}
			</div>
			<div class={`flex items-center justify-between border-t border-border ${pad[local.size ?? "md"]} pt-4`}>
				<button
					type="button"
					disabled={step() === 0}
					class="h-9 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onClick={() => go(-1)}
				>
					{labels().back}
				</button>
				<span class="text-2xs tabular-nums text-muted-foreground">
					Step {step() + 1} of {steps().length}
				</span>
				<button
					type="button"
					class="h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => go(1)}
				>
					{last() ? labels().finish : labels().next}
				</button>
			</div>
		</div>
	);
}
