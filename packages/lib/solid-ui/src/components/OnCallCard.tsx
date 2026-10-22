/**
 * OnCallCard - on-call schedule card: current responder, next up and escalation chain.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Avatar } from "./Avatar";

export interface OnCallPerson {
	/** Display name. */
	name: string;
	/** Avatar image URL — initials fallback when omitted. */
	avatar?: string;
}

export interface OnCallCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Schedule label, e.g. "Backend primary". */
	schedule: string;
	/** Person currently on call. */
	current: OnCallPerson;
	/** Next person in the rotation. */
	next?: OnCallPerson;
	/** Escalation chain, in order. */
	escalation?: OnCallPerson[];
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const initials = (name?: string) =>
	(name ?? "")
		.split(/\s+/)
		.map((p) => p[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();

export function OnCallCard(props: OnCallCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"schedule",
		"current",
		"next",
		"escalation",
		"radius",
		"elevation",
		"unstyled",
	]);

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-on-call-card border border-border bg-surface p-4",
					radiusMap[local.radius ?? "lg"],
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center justify-between gap-3">
				<span class="truncate text-sm font-semibold text-foreground">{local.schedule}</span>
				<span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-2xs font-medium text-success">
					<span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
					on call
				</span>
			</div>
			<div class="mt-3 flex items-center gap-3">
				<Avatar
					src={local.current?.avatar}
					alt={local.current?.name}
					size="sm"
					fallback={initials(local.current?.name)}
				/>
				<div class="min-w-0">
					<div class="truncate text-sm font-medium text-foreground">{local.current?.name}</div>
					<div class="text-2xs text-muted-foreground">Now</div>
				</div>
			</div>
			<Show when={local.next}>
				{(next) => (
					<div class="mt-3 flex items-center gap-3 border-t border-border pt-3">
						<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-2xs font-medium text-muted-foreground">
							{initials(next().name)}
						</span>
						<div class="min-w-0">
							<div class="truncate text-xs font-medium text-foreground">{next().name}</div>
							<div class="text-2xs text-muted-foreground">Next</div>
						</div>
					</div>
				)}
			</Show>
			<Show when={(local.escalation ?? []).length > 0}>
				<div class="mt-3 border-t border-border pt-3">
					<div class="text-2xs font-medium uppercase tracking-wide text-muted-foreground">Escalation</div>
					<ol class="mt-1.5 m-0 list-none space-y-1 p-0">
						<For each={local.escalation}>
							{(person, i) => (
								<li class="flex items-center gap-2 text-xs">
									<span class="w-4 shrink-0 text-right text-2xs tabular-nums text-muted-foreground">{i() + 1}.</span>
									<span class="truncate text-foreground">{person.name}</span>
								</li>
							)}
						</For>
					</ol>
				</div>
			</Show>
		</div>
	);
}
