/**
 * ProfileCard — identity card with avatar, bio, stats row, and action buttons.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";

export interface ProfileStat {
	/** Stat label under the value */
	label: string;
	/** Stat value (formatted string ok) */
	value: string | number;
}

export interface ProfileCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Display name */
	name: string;
	/** Handle or role line, e.g. "@newkub" */
	handle?: string;
	/** Avatar image URL */
	avatar?: string;
	/** Short bio */
	bio?: string;
	/** Stats row (followers, repos…) */
	stats?: ProfileStat[];
	/** Primary action label — renders Follow/Message style buttons */
	primaryAction?: string;
	/** Secondary action label */
	secondaryAction?: string;
	/** Handlers */
	onPrimary?: () => void;
	onSecondary?: () => void;
	/** Cover/banner image URL behind the header */
	cover?: string;
	/** Card visual variant @default "default" */
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Card content density */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ProfileCard(props: ProfileCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"handle",
		"avatar",
		"bio",
		"stats",
		"primaryAction",
		"secondaryAction",
		"onPrimary",
		"onSecondary",
		"cover",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<Card
			variant={local.variant}
			class={`solidui-profile-card w-full max-w-sm overflow-hidden ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.cover}>
				<div
					class="h-20 w-full bg-muted bg-cover bg-center"
					style={local.cover ? { "background-image": `url(${local.cover})` } : undefined}
					aria-hidden="true"
				/>
			</Show>
			<CardContent class={local.cover ? "-mt-8" : "pt-6"} size={local.size}>
				<Avatar src={local.avatar} alt={local.name} size="lg" class={local.cover ? "ring-4 ring-card" : ""} />
				<div class="mt-3">
					<h3 class="text-base font-semibold text-foreground">{local.name}</h3>
					<Show when={local.handle}>
						<p class="text-sm text-muted-foreground">{local.handle}</p>
					</Show>
				</div>
				<Show when={local.bio}>
					<p class="mt-2 text-sm text-muted-foreground">{local.bio}</p>
				</Show>
				<Show when={local.stats?.length}>
					<div class="mt-4 flex gap-6 border-t border-border pt-3">
						<For each={local.stats}>
							{(s) => (
								<div>
									<p class="text-sm font-semibold text-foreground">{s.value}</p>
									<p class="text-2xs text-muted-foreground">{s.label}</p>
								</div>
							)}
						</For>
					</div>
				</Show>
				<Show when={local.primaryAction || local.secondaryAction}>
					<div class="mt-4 flex gap-2">
						<Show when={local.primaryAction}>
							<Button variant="primary" size="sm" class="flex-1" onClick={local.onPrimary}>
								{local.primaryAction}
							</Button>
						</Show>
						<Show when={local.secondaryAction}>
							<Button variant="secondary" size="sm" class="flex-1" onClick={local.onSecondary}>
								{local.secondaryAction}
							</Button>
						</Show>
					</div>
				</Show>
			</CardContent>
		</Card>
	);
}
