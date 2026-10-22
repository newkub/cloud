/**
 * AuditRow — audit-log row: severity icon, actor avatar + name, action, target and timestamp.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius } from "../lib/variants";
import { Avatar } from "./Avatar";

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditRowActor {
	/** Actor display name. */
	name: string;
	/** Avatar image URL — falls back to initials. */
	avatar?: string;
}

export interface AuditRowEntry {
	/** Who performed the action. */
	actor: AuditRowActor;
	/** Action verb, e.g. "deleted". */
	action: string;
	/** Target label, e.g. "repo wrikka/solid-ui". */
	target?: string;
	/** Timestamp text, e.g. "2m ago". */
	ts: string;
	/** Severity — drives the icon color. @default "info" */
	severity?: AuditSeverity;
}

export interface AuditRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Audit entry to render. */
	entry?: AuditRowEntry;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const severityIcon: Record<AuditSeverity, { cls: string; label: string; path: string }> = {
	info: { cls: "text-muted-foreground", label: "Info", path: "M12 8h.01M12 12v4m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
	warning: {
		cls: "text-warning",
		label: "Warning",
		path: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
	},
	critical: {
		cls: "text-destructive",
		label: "Critical",
		path: "M12 8v4m0 4h.01M7.9 3h8.2L21 7.9v8.2L16.1 21H7.9L3 16.1V7.9L7.9 3Z",
	},
};

const initials = (name?: string) =>
	(name ?? "")
		.split(/\s+/)
		.map((w) => w.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

export function AuditRow(props: AuditRowProps) {
	const [local, rest] = splitProps(props, ["class", "entry", "radius", "elevation"]);
	const icon = () => severityIcon[local.entry?.severity ?? "info"];
	return (
		<div
			class={`solidui-audit-row flex items-center gap-2.5 border-b border-border/50 py-2.5 last:border-0 ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				class={`h-4 w-4 shrink-0 ${icon().cls}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				role="img"
				aria-label={icon().label}
			>
				<path d={icon().path} />
			</svg>
			<Avatar
				src={local.entry?.actor.avatar}
				alt={local.entry?.actor.name}
				fallback={initials(local.entry?.actor.name)}
				size="sm"
				class="h-6 w-6"
			/>
			<p class="min-w-0 flex-1 truncate text-xs">
				<span class="font-medium text-foreground">{local.entry?.actor.name}</span>{" "}
				<span class="text-muted-foreground">{local.entry?.action}</span>{" "}
				<Show when={local.entry?.target}>
					<span class="font-medium text-foreground">{local.entry?.target}</span>
				</Show>
			</p>
			<time class="shrink-0 text-2xs text-muted-foreground">{local.entry?.ts}</time>
		</div>
	);
}
