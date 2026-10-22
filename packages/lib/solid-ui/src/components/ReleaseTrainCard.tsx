/**
 * ReleaseTrainCard - release stage rail: version header with done/active/pending stage dots and connectors.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ReleaseStage {
	/** Stage label, e.g. "canary". */
	name: string;
	/** Stage progress. */
	status: "done" | "active" | "pending";
	/** Optional date text, e.g. "Mar 4". */
	date?: string;
}

export interface ReleaseTrainCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Release version, e.g. "v2.4.0". */
	version: string;
	/** Ordered stages rendered left-to-right. */
	stages: ReleaseStage[];
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const dotClass: Record<ReleaseStage["status"], string> = {
	done: "border-success bg-success text-success-foreground",
	active: "border-primary bg-primary text-primary-foreground",
	pending: "border-border bg-muted text-muted-foreground",
};

const labelClass: Record<ReleaseStage["status"], string> = {
	done: "text-foreground",
	active: "font-semibold text-primary",
	pending: "text-muted-foreground",
};

export function ReleaseTrainCard(props: ReleaseTrainCardProps) {
	const [local, rest] = splitProps(props, ["class", "version", "stages", "radius", "elevation", "unstyled"]);

	const stages = () => local.stages ?? [];
	const doneCount = () => stages().filter((s) => s.status === "done").length;

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-release-train-card border border-border bg-surface p-4",
					radiusMap[local.radius ?? "lg"],
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-baseline justify-between gap-3">
				<span class="font-mono text-sm font-semibold text-foreground">{local.version}</span>
				<span class="text-2xs tabular-nums text-muted-foreground">
					{doneCount()}/{stages().length} stages
				</span>
			</div>
			<ol class="mt-4 flex list-none items-start gap-0 p-0">
				<For each={stages()}>
					{(stage, i) => (
						<li class="flex min-w-0 flex-1 items-start">
							<div class="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
								<div class="flex w-full items-center">
									<span
										class={`h-0.5 flex-1 ${i() === 0 ? "bg-transparent" : stage.status === "pending" ? "bg-border" : "bg-success"}`}
										aria-hidden="true"
									/>
									<span
										class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${dotClass[stage.status]}`}
									>
										<Show when={stage.status === "done"}>
											<NamedIcon name="check" class="h-2.5 w-2.5" />
										</Show>
										<Show when={stage.status === "active"}>
											<span class="h-1.5 w-1.5 rounded-full bg-primary-foreground" aria-hidden="true" />
										</Show>
									</span>
									<span
										class={`h-0.5 flex-1 ${i() === stages().length - 1 ? "bg-transparent" : stages()[i() + 1]?.status === "pending" ? "bg-border" : "bg-success"}`}
										aria-hidden="true"
									/>
								</div>
								<span class={`max-w-full truncate text-xs ${labelClass[stage.status]}`}>{stage.name}</span>
								<Show when={stage.date}>
									<span class="text-2xs tabular-nums text-muted-foreground">{stage.date}</span>
								</Show>
							</div>
						</li>
					)}
				</For>
			</ol>
		</div>
	);
}
