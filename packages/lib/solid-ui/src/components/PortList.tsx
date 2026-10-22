/**
 * PortList — listening-ports table: port, protocol, pid, process and a
 * kill action.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface PortInfo {
	/** Port number */
	port: number;
	/** Protocol. @default "tcp" */
	proto?: string;
	/** Owning process id */
	pid?: number;
	/** Owning process name */
	process?: string;
}

export interface PortListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	ports: PortInfo[];
	/** Called when a row's kill button is pressed. Omit to hide the action. */
	onKill?: (port: PortInfo) => void;
	/** Corner radius. */
	radius?: Radius;
}

const th = "px-3 py-1.5 font-mono text-2xs font-semibold uppercase tracking-wide text-muted-foreground";

export function PortList(props: PortListProps) {
	const [local, rest] = splitProps(props, ["class", "ports", "onKill", "radius"]);
	return (
		<div
			class={`solidui-port-list overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<table class="w-full text-left text-xs">
				<thead class="border-b border-border bg-muted/40">
					<tr>
						<th scope="col" class={th}>
							Port
						</th>
						<th scope="col" class={th}>
							Proto
						</th>
						<th scope="col" class={th}>
							PID
						</th>
						<th scope="col" class={th}>
							Process
						</th>
						<Show when={local.onKill}>
							<th scope="col" class={`${th} text-right`}>
								<span class="sr-only">Actions</span>
							</th>
						</Show>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					<For each={local.ports ?? []}>
						{(p) => (
							<tr class="hover:bg-muted/40">
								<td class="px-3 py-1.5 font-mono font-semibold text-foreground">{p.port}</td>
								<td class="px-3 py-1.5 font-mono uppercase text-muted-foreground">{p.proto ?? "tcp"}</td>
								<td class="px-3 py-1.5 font-mono text-muted-foreground">{p.pid ?? "—"}</td>
								<td class="px-3 py-1.5 font-mono text-foreground/90">{p.process ?? "—"}</td>
								<Show when={local.onKill}>
									<td class="px-3 py-1 text-right">
										<button
											type="button"
											class="inline-flex h-6 items-center rounded border border-destructive/30 bg-destructive/10 px-2 font-mono text-2xs text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
											aria-label={`Kill ${p.process ?? "process"} on port ${p.port}`}
											onClick={() => local.onKill?.(p)}
										>
											Kill
										</button>
									</td>
								</Show>
							</tr>
						)}
					</For>
				</tbody>
			</table>
			<Show when={(local.ports ?? []).length === 0}>
				<p class="m-0 px-3 py-2 text-xs text-muted-foreground">No listening ports.</p>
			</Show>
		</div>
	);
}
