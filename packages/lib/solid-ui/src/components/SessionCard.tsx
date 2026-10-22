/**
 * SessionCard — active session row: device icon, location, current badge and revoke action.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius } from "../lib/variants";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface SessionCardSession {
	/** Device/UA hint, e.g. "Chrome on macOS" or "iPhone 15" — drives the icon. */
	device: string;
	/** Location text, e.g. "Bangkok, TH". */
	location?: string;
	/** Marks the current session — shows a badge and hides revoke. @default false */
	current?: boolean;
	/** Last-active text, e.g. "Active now". */
	lastActive?: string;
}

export interface SessionCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Session to render. */
	session?: SessionCardSession;
	/** Called when revoke is clicked — hidden for the current session. */
	onRevoke?: (session: SessionCardSession) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const isMobile = (device: string) => /mobile|iphone|ipad|android|phone/i.test(device);

export function SessionCard(props: SessionCardProps) {
	const [local, rest] = splitProps(props, ["class", "session", "onRevoke", "radius", "elevation"]);
	return (
		<div
			class={`solidui-session-card flex items-center gap-3 border-b border-border/50 py-3 last:border-0 ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					role="img"
					aria-label={isMobile(local.session?.device ?? "") ? "Mobile device" : "Browser session"}
				>
					<Show
						when={isMobile(local.session?.device ?? "")}
						fallback={
							<>
								<rect x="3" y="4" width="18" height="14" rx="2" />
								<path d="M3 8h18M7 6.5h.01" />
							</>
						}
					>
						<rect x="7" y="2" width="10" height="20" rx="2" />
						<path d="M11 18h2" />
					</Show>
				</svg>
			</span>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<span class="truncate text-sm font-medium text-foreground">{local.session?.device}</span>
					<Show when={local.session?.current}>
						<Badge variant="success" size="sm">
							This device
						</Badge>
					</Show>
				</div>
				<div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-2xs text-muted-foreground">
					<Show when={local.session?.location}>
						<span>{local.session?.location}</span>
					</Show>
					<Show when={local.session?.lastActive}>
						<span>{local.session?.lastActive}</span>
					</Show>
				</div>
			</div>
			<Show when={local.onRevoke && !local.session?.current}>
				<Button
					variant="ghost"
					size="sm"
					class="shrink-0 text-destructive hover:text-destructive"
					onClick={() => local.session && local.onRevoke?.(local.session)}
				>
					Revoke
				</Button>
			</Show>
		</div>
	);
}
