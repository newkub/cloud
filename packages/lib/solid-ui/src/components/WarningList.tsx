/**
 * WarningList — grouped warnings with a severity icon, message, count badge and per-row dismiss.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type WarningSeverity = "warning" | "error" | "info";

export interface WarningItem {
	/** Warning message. */
	message: string;
	/** Occurrence count — renders a badge when greater than 1. */
	count?: number;
	/** Severity tone. @default "warning" */
	severity?: WarningSeverity;
}

export interface WarningListProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Warnings to display. */
	warnings: WarningItem[];
	/** Called with the warning index when its dismiss button is clicked — hidden when omitted. */
	onDismiss?: (index: number) => void;
	/** Corner radius of the rows. */
	radius?: Radius;
}

const severityColor: Record<WarningSeverity, string> = {
	warning: "text-warning",
	error: "text-destructive",
	info: "text-info",
};

const WarningIcon = (props: { severity: WarningSeverity }) => (
	<span class={`inline-flex h-3.5 w-3.5 shrink-0 ${severityColor[props.severity]}`} aria-hidden="true">
		<Show
			when={props.severity === "error"}
			fallback={
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
					<path d="M12 9v4" />
					<path d="M12 17h.01" />
				</svg>
			}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-3.5 w-3.5"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="m15 9-6 6" />
				<path d="m9 9 6 6" />
			</svg>
		</Show>
	</span>
);

export function WarningList(props: WarningListProps) {
	const [local, rest] = splitProps(props, ["class", "warnings", "onDismiss", "radius"]);
	return (
		<ul class={`solidui-warning-list flex flex-col gap-1.5 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.warnings}>
				{(warning, index) => (
					<li
						class={`flex items-center gap-2 border border-border bg-surface px-2.5 py-1.5 text-xs ${radiusMap[local.radius ?? "md"]}`}
					>
						<WarningIcon severity={warning.severity ?? "warning"} />
						<span class="min-w-0 flex-1 truncate text-foreground">{warning.message}</span>
						<Show when={(warning.count ?? 0) > 1}>
							<span class="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-2xs tabular-nums text-muted-foreground">
								×{warning.count}
							</span>
						</Show>
						<Show when={local.onDismiss}>
							<button
								type="button"
								class="inline-flex shrink-0 items-center rounded p-0.5 transition-colors text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none"
								aria-label={`Dismiss warning: ${warning.message}`}
								onClick={() => local.onDismiss?.(index())}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									class="h-3 w-3"
									aria-hidden="true"
								>
									<path d="m18 6-12 12" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
						</Show>
					</li>
				)}
			</For>
		</ul>
	);
}
