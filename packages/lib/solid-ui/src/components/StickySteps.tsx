/**
 * StickySteps — scrollytelling layout: a sticky media column beside steps that activate on scroll.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface StickyStep {
	title: string;
	body: string;
}

export interface StickyStepsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Steps shown in the scrolling column. */
	steps: StickyStep[];
	/** Media rendered for the active step in the sticky column. */
	media?: (index: number) => JSX.Element;
	/** Intersection ratio needed to activate a step. @default 0.5 */
	threshold?: number;
	/** Panel tone for the sticky media frame. @default "default" */
	variant?: SurfaceVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function StickySteps(props: StickyStepsProps) {
	const [local, pass] = splitProps(props, ["steps", "media", "threshold", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "grid gap-8 md:grid-cols-2",
		variants: surfaceVariants,
		defaultVariant: "default",
		unstyled: props.unstyled,
	});
	const [active, setActive] = createSignal(0);
	const stepEls: HTMLElement[] = [];

	onMount(() => {
		if (typeof IntersectionObserver !== "function") return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						const idx = stepEls.indexOf(e.target as HTMLElement);
						if (idx >= 0) setActive(idx);
					}
				}
			},
			{ threshold: local.threshold ?? 0.5 },
		);
		for (const el of stepEls) observer.observe(el);
		onCleanup(() => observer.disconnect());
	});

	return (
		<div class={className()} {...rest}>
			<div class="flex flex-col gap-24 py-16">
				<For each={local.steps ?? []}>
					{(step, i) => (
						<section
							ref={(el) => {
								stepEls[i()] = el;
							}}
							data-active={active() === i() ? "true" : "false"}
							class={`solidui-sticky-step min-h-[40vh] transition-opacity duration-300 motion-reduce:transition-none ${
								active() === i() ? "opacity-100" : "opacity-40"
							}`}
						>
							<h3 class="text-lg font-semibold text-foreground">{step.title}</h3>
							<p class="mt-2 text-sm text-muted-foreground">{step.body}</p>
						</section>
					)}
				</For>
			</div>
			<div class="hidden md:block">
				<div
					class={`solidui-sticky-steps-media sticky top-16 rounded-lg border p-4 ${surfaceVariants[pass.variant ?? "default"]}`}
				>
					{local.media ? local.media(active()) : null}
				</div>
			</div>
		</div>
	);
}
