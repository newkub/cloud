/**
 * ApiStatusBadge - status chip with a colored dot for API health states.
 */

import { type JSX, Show, splitProps } from "solid-js";
import { type ChipVariant, chipVariants, type Radius, radiusMap } from "../lib/variants";

export type ApiStatus = "operational" | "degraded" | "down" | "unknown";

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-2 py-0.5 text-2xs",
	md: "px-2.5 py-0.5 text-xs",
	lg: "px-3 py-1 text-sm",
};

const statusMeta: Record<ApiStatus, { label: string; tone: ChipVariant; dot: string; pulse: boolean }> = {
	operational: { label: "Operational", tone: "success", dot: "bg-success", pulse: true },
	degraded: { label: "Degraded", tone: "warning", dot: "bg-warning", pulse: true },
	down: { label: "Down", tone: "destructive", dot: "bg-destructive", pulse: false },
	unknown: { label: "Unknown", tone: "default", dot: "bg-muted-foreground", pulse: false },
};

export interface ApiStatusBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Current API health state. @default "unknown" */
	status?: ApiStatus;
	/** Override the default status label. */
	label?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ApiStatusBadge(props: ApiStatusBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "status", "label", "size", "radius", "unstyled", "children"]);

	const meta = () => statusMeta[local.status ?? "unknown"];
	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-api-status-badge inline-flex items-center gap-1.5 border font-semibold transition-colors",
					chipVariants[meta().tone],
					sizeMap[local.size ?? "md"],
					radiusMap[local.radius ?? "full"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<span class={className()} role="status" {...rest}>
			<span class="relative inline-flex h-2 w-2 shrink-0" aria-hidden="true">
				<Show when={meta().pulse && !local.unstyled}>
					<span
						class={`absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping ${meta().dot}`}
					/>
				</Show>
				<span class={`relative inline-flex h-2 w-2 rounded-full ${local.unstyled ? "" : meta().dot}`} />
			</span>
			{local.children ?? local.label ?? meta().label}
		</span>
	);
}
