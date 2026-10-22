/**
 * LifecycleDiagram - circular lifecycle stages.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, type Radius, radiusMap } from "../lib/variants";

export interface LifecycleDiagramProps extends JSX.OlHTMLAttributes<HTMLOListElement> {
	/** Step descriptors */
	steps?: { title: string; description?: string; icon?: JSX.Element }[];
	/** Current step index, 0-based @default 0 */
	current?: number;
	/** Called when a step is clicked */
	onStep?: (index: number) => void;
	/** Layout @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Loop back to start @default true */
	cycle?: boolean;
}

export function LifecycleDiagram(props: LifecycleDiagramProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"steps",
		"current",
		"onStep",
		"orientation",
		"radius",
		"elevation",
		"children",
		"cycle",
	]);
	const isVert = () => local.orientation === "vertical";
	return (
		<ol
			class={`solidui-lifecycle-diagram flex ${isVert() ? "flex-col gap-3" : "items-center gap-2"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.steps ?? []}>
				{(step, i) => (
					<li class={`flex ${isVert() ? "items-start gap-3" : "flex-1 flex-col items-center gap-1 text-center"}`}>
						<button
							type="button"
							class={`flex items-center gap-2 ${local.onStep ? "cursor-pointer" : "cursor-default"} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
							aria-current={i() === (local.current ?? 0) ? "step" : undefined}
							onClick={() => local.onStep?.(i())}
						>
							<span
								class={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${i() < (local.current ?? 0) ? "border-success bg-success/10 text-success" : i() === (local.current ?? 0) ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}
								aria-hidden="true"
							>
								{step.icon ?? i() + 1}
							</span>
							<span class="text-left">
								<span class="block text-sm font-medium text-foreground">{step.title}</span>
								<Show when={step.description}>
									<span class="block text-2xs text-muted-foreground">{step.description}</span>
								</Show>
							</span>
						</button>
					</li>
				)}
			</For>
		</ol>
	);
}
