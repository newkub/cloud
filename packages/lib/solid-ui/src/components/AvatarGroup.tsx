/**
 * AvatarGroup - stacked avatar row with overflow count.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Avatar } from "./Avatar";

export interface AvatarGroupItem {
	src?: string;
	alt?: string;
	fallback?: JSX.Element;
}

const avatarGroupVariants = {
	circle: "rounded-full",
	square: "rounded-none",
	rounded: "rounded-md",
} as const;

export interface AvatarGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items?: AvatarGroupItem[];
	max?: number;
	size?: "sm" | "md" | "lg" | "xl";
	variant?: keyof typeof avatarGroupVariants;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClasses: Record<NonNullable<AvatarGroupProps["size"]>, string> = {
	sm: "h-6 w-6 text-[10px]",
	md: "h-8 w-8 text-xs",
	lg: "h-10 w-10 text-sm",
	xl: "h-16 w-16 text-base",
};

export function AvatarGroup(props: AvatarGroupProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"items",
		"max",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const size = () => sizeClasses[local.size ?? "md"];
	const shape = () => avatarGroupVariants[local.variant ?? "circle"];
	const max = () => local.max ?? Number.POSITIVE_INFINITY;
	const visible = () => (local.items ?? []).slice(0, Math.max(0, max()));
	const overflow = () => Math.max(0, (local.items?.length ?? 0) - visible().length);

	const className = () =>
		[
			"flex items-center -space-x-2",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<For each={visible()}>
				{(item) => (
					<Avatar
						src={item.src}
						alt={item.alt}
						fallback={item.fallback}
						variant={local.variant}
						class={`${size()} ring-2 ring-background`}
					/>
				)}
			</For>
			{local.children}
			<Show when={overflow() > 0}>
				<span
					class={`flex items-center justify-center bg-muted font-medium text-muted-foreground ring-2 ring-background ${shape()} ${size()}`}
					role="img"
					aria-label={`${overflow()} more`}
				>
					+{overflow()}
				</span>
			</Show>
		</div>
	);
}
