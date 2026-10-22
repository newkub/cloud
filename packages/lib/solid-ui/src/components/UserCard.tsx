/**
 * UserCard — profile card: avatar, name, handle, role badge, stats row and follow/message actions.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface UserCardStats {
	/** Post count. */
	posts?: number;
	/** Follower count. */
	followers?: number;
	/** Following count. */
	following?: number;
}

export interface UserCardUser {
	/** Display name. */
	name: string;
	/** Handle, e.g. "@ada". */
	handle: string;
	/** Avatar image URL — falls back to initials. */
	avatar?: string;
	/** Role label rendered as a badge, e.g. "Admin". */
	role?: string;
	/** Stats row (posts / followers / following). */
	stats?: UserCardStats;
}

export interface UserCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** User to render. */
	user?: UserCardUser;
	/** Called when the follow button is toggled — receives the new state. */
	onFollow?: (user: UserCardUser, following: boolean) => void;
	/** Called when the message button is clicked — hides it when omitted. */
	onMessage?: (user: UserCardUser) => void;
	/** Start in the "following" state. @default false */
	following?: boolean;
	/** Hide the action buttons. @default false */
	hideActions?: boolean;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

export function UserCard(props: UserCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"user",
		"onFollow",
		"onMessage",
		"following",
		"hideActions",
		"variant",
		"radius",
		"elevation",
	]);
	const [following, setFollowing] = createSignal(local.following ?? false);
	const initials = () =>
		local.user?.name
			.split(/\s+/)
			.map((w) => w.charAt(0))
			.slice(0, 2)
			.join("")
			.toUpperCase();
	const toggleFollow = () => {
		const next = !following();
		setFollowing(next);
		local.user && local.onFollow?.(local.user, next);
	};
	return (
		<div
			class={`solidui-user-card border p-4 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start gap-3">
				<Avatar src={local.user?.avatar} alt={local.user?.name} fallback={initials()} size="lg" />
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<span class="truncate text-sm font-semibold text-foreground">{local.user?.name}</span>
						<Show when={local.user?.role}>
							<Badge variant="primary" size="sm">
								{local.user?.role}
							</Badge>
						</Show>
					</div>
					<span class="text-xs text-muted-foreground">{local.user?.handle}</span>
				</div>
			</div>
			<Show when={local.user?.stats}>
				<div class="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
					<Show when={local.user?.stats?.posts !== undefined}>
						<span>
							<span class="font-semibold tabular-nums text-foreground">{fmt(local.user?.stats?.posts ?? 0)}</span> posts
						</span>
					</Show>
					<Show when={local.user?.stats?.followers !== undefined}>
						<span>
							<span class="font-semibold tabular-nums text-foreground">{fmt(local.user?.stats?.followers ?? 0)}</span>{" "}
							followers
						</span>
					</Show>
					<Show when={local.user?.stats?.following !== undefined}>
						<span>
							<span class="font-semibold tabular-nums text-foreground">{fmt(local.user?.stats?.following ?? 0)}</span>{" "}
							following
						</span>
					</Show>
				</div>
			</Show>
			<Show when={!local.hideActions}>
				<div class="mt-4 flex items-center gap-2">
					<Button
						variant={following() ? "secondary" : "primary"}
						size="sm"
						aria-pressed={following()}
						onClick={toggleFollow}
					>
						{following() ? "Following" : "Follow"}
					</Button>
					<Show when={local.onMessage}>
						<Button variant="default" size="sm" onClick={() => local.user && local.onMessage?.(local.user)}>
							Message
						</Button>
					</Show>
				</div>
			</Show>
		</div>
	);
}
