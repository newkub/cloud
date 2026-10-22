/**
 * DeployStageBar - horizontal pipeline of stage pills with connectors and elapsed labels.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type DeployStageStatus = "done" | "active" | "failed" | "pending";

export interface DeployStage {
	/** Stage name, e.g. "build". */
	name: string;
	status: DeployStageStatus;
	/** Elapsed/remaining label, e.g. "1m 24s". */
	elapsed?: string;
}

export interface DeployStageBarProps extends JSX.HTMLAttributes<HTMLOListElement> {
	stages: DeployStage[];
	/** Pill corner radius. @default "full" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const pillCls: Record<DeployStageStatus, string> = {
	done: "border-success/30 bg-success/10 text-success",
	active: "border-primary/40 bg-primary/10 text-primary shadow-sm",
	failed: "border-destructive/30 bg-destructive/10 text-destructive",
	pending: "border-border bg-muted/50 text-muted-foreground",
};

const dotCls: Record<DeployStageStatus, string> = {
	done: "bg-success",
	active: "bg-primary motion-safe:animate-pulse",
	failed: "bg-destructive",
	pending: "bg-muted-foreground/60",
};

export function DeployStageBar(props: DeployStageBarProps) {
	const [local, restProps] = splitProps(props, ["stages", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-deploy-stage-bar flex list-none items-center gap-0 m-0 p-0",
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const stages = () => local.stages ?? [];
	const pillRadius = () => radiusMap[props.radius ?? "full"];
	return (
		<ol class={className()} {...rest}>
			<For each={stages()}>
				{(s, i) => (
					<li class="flex min-w-0 flex-1 items-center last:flex-none">
						<span
							class={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-2xs font-medium ${pillRadius()} ${pillCls[s.status]}`}
							aria-current={s.status === "active" ? "step" : undefined}
						>
							<span class={`h-1.5 w-1.5 shrink-0 rounded-full ${dotCls[s.status]}`} aria-hidden="true" />
							<span class="max-w-32 truncate">{s.name}</span>
							<Show when={s.elapsed}>
								<span class="tabular-nums opacity-75">{s.elapsed}</span>
							</Show>
							<span class="sr-only">({s.status})</span>
						</span>
						<Show when={i() < stages().length - 1}>
							<span
								class={`mx-1.5 h-px min-w-3 flex-1 ${s.status === "done" ? "bg-success/50" : "bg-border"}`}
								aria-hidden="true"
							/>
						</Show>
					</li>
				)}
			</For>
			{local.children}
		</ol>
	);
}
