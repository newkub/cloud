/**
 * CheckoutSteps — horizontal cart → shipping → payment → review stepper with done/active/pending states.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface CheckoutStep {
	/** Stable step id, e.g. "shipping". */
	id: string;
	label: string;
}

export interface CheckoutStepsProps extends JSX.HTMLAttributes<HTMLElement> {
	/**
	 * Current step — 0-based index or a step `id`. @default 0
	 */
	current?: number | string;
	/** Step descriptors. @default cart → shipping → payment → review */
	steps?: CheckoutStep[];
	/** Called when a completed step is clicked (pending/future steps are inert). */
	onStep?: (index: number, step: CheckoutStep) => void;
	/** Let users click completed steps to go back. @default true */
	clickable?: boolean;
}

const defaultSteps: CheckoutStep[] = [
	{ id: "cart", label: "Cart" },
	{ id: "shipping", label: "Shipping" },
	{ id: "payment", label: "Payment" },
	{ id: "review", label: "Review" },
];

export function CheckoutSteps(props: CheckoutStepsProps) {
	const [local, rest] = splitProps(props, ["class", "current", "steps", "onStep", "clickable"]);
	const steps = () => local.steps ?? defaultSteps;
	const currentIndex = () => {
		if (typeof local.current === "string") {
			const i = steps().findIndex((s) => s.id === local.current);
			return i < 0 ? 0 : i;
		}
		return local.current ?? 0;
	};

	const check = (
		<svg
			class="h-3.5 w-3.5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);

	return (
		<nav aria-label="Checkout progress" class={`solidui-checkout-steps ${local.class ?? ""}`.trim()} {...rest}>
			<ol class="flex w-full items-start">
				<For each={steps()}>
					{(step, i) => {
						const state = () => (i() < currentIndex() ? "done" : i() === currentIndex() ? "active" : "pending");
						const last = () => i() === steps().length - 1;
						const canClick = () => state() === "done" && (local.clickable ?? true);
						return (
							<li class="flex flex-1 items-start last:flex-none">
								<div class="flex min-w-0 flex-col items-center gap-1.5">
									<button
										type="button"
										disabled={!canClick()}
										aria-current={state() === "active" ? "step" : undefined}
										aria-label={`${step.label} — ${state() === "done" ? "completed" : state() === "active" ? "current step" : "upcoming"}`}
										class={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
											state() === "done"
												? `border-primary bg-primary text-primary-foreground ${canClick() ? "hover:bg-primary/90" : ""}`
												: state() === "active"
													? "border-primary bg-primary/10 text-primary"
													: "border-border bg-muted text-muted-foreground"
										} ${canClick() ? "cursor-pointer" : "cursor-default"}`}
										onClick={() => canClick() && local.onStep?.(i(), step)}
									>
										<Show when={state() === "done"} fallback={i() + 1}>
											{check}
										</Show>
									</button>
									<span
										class={`truncate text-2xs font-medium sm:text-xs ${
											state() === "active" ? "text-foreground" : "text-muted-foreground"
										}`}
									>
										{step.label}
									</span>
								</div>
								<Show when={!last()}>
									<span
										aria-hidden="true"
										class={`mx-2 mt-4 h-0.5 flex-1 rounded-full ${i() < currentIndex() ? "bg-primary" : "bg-border"}`}
									/>
								</Show>
							</li>
						);
					}}
				</For>
			</ol>
		</nav>
	);
}
