/**
 * Tour - guided step-by-step product tour overlay.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, mergeProps, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-lg",
};

export interface TourStep {
	title?: string;
	content: string;
}

export interface TourProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps?: TourStep[];
	step?: number;
	defaultStep?: number;
	onStepChange?: (step: number) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onFinish?: () => void;
	nextLabel?: string;
	prevLabel?: string;
	finishLabel?: string;
	skipLabel?: string;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Tour(props: TourProps) {
	const merged = mergeProps({ defaultStep: 0 }, props);
	const [internal, setInternal] = createSignal(merged.defaultStep);
	const [internalOpen, setInternalOpen] = createSignal(true);
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"steps",
		"step",
		"defaultStep",
		"onStepChange",
		"open",
		"onOpenChange",
		"onFinish",
		"nextLabel",
		"prevLabel",
		"finishLabel",
		"skipLabel",
		"variant",
		"size",
		"radius",
		"elevation",
	]);

	const open = () => (local.open !== undefined ? local.open : internalOpen());
	const setOpen = (next: boolean) => {
		setInternalOpen(next);
		local.onOpenChange?.(next);
	};

	const steps = () => local.steps ?? [];
	const step = () => (local.step !== undefined ? local.step : internal());
	const current = () => steps()[step()];
	const isFirst = () => step() === 0;
	const isLast = () => step() === steps().length - 1;

	const goTo = (next: number) => {
		setInternal(next);
		local.onStepChange?.(next);
	};
	const next = () => {
		if (isLast()) {
			local.onFinish?.();
			setOpen(false);
		} else {
			goTo(step() + 1);
		}
	};
	const prev = () => {
		if (!isFirst()) goTo(step() - 1);
	};
	const skip = () => setOpen(false);

	useEscapeKey(skip, { when: open });

	const className = () =>
		[
			"w-72 max-w-[calc(100vw-2rem)] border motion-safe:animate-[su-fade-in_var(--su-transition-normal)]",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "md"],
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const btn =
		"rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<Show when={open() && current()}>
			<div class={className()} role="dialog" aria-label={current()?.title ?? "Tour"} {...rest}>
				<Show when={current()?.title}>
					<div class="mb-1 text-sm font-semibold">{current()?.title}</div>
				</Show>
				<div class="text-sm text-muted-foreground">{current()?.content}</div>
				{local.children}
				<div class="mt-4 flex items-center justify-between">
					<button type="button" class={`${btn} text-muted-foreground hover:text-foreground`} onClick={skip}>
						{local.skipLabel ?? "Skip"}
					</button>
					<div class="flex items-center gap-2">
						<span class="text-xs text-muted-foreground">
							{step() + 1} / {steps().length}
						</span>
						<Show when={!isFirst()}>
							<button type="button" class={`${btn} border border-border hover:bg-muted`} onClick={prev}>
								{local.prevLabel ?? "Back"}
							</button>
						</Show>
						<button
							type="button"
							class={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}
							onClick={next}
						>
							{isLast() ? (local.finishLabel ?? "Done") : (local.nextLabel ?? "Next")}
						</button>
					</div>
				</div>
			</div>
		</Show>
	);
}
