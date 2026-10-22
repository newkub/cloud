/**
 * NotFoundPage — centered 404 template with code, message and actions.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface NotFoundAction {
	label: string;
	href?: string;
	onClick?: () => void;
}

export interface NotFoundPageProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Big status code. @default "404" */
	code?: string;
	title?: string;
	message?: string;
	primaryAction?: NotFoundAction;
	secondaryAction?: NotFoundAction;
	/** Media/illustration slot. */
	media?: JSX.Element;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Fill viewport height. @default true */
	fullHeight?: boolean;
}

const codeSize = { sm: "text-5xl", md: "text-7xl", lg: "text-8xl" } as const;
const titleSize = { sm: "text-base", md: "text-xl", lg: "text-2xl" } as const;

export function NotFoundPage(props: NotFoundPageProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"code",
		"title",
		"message",
		"primaryAction",
		"secondaryAction",
		"media",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullHeight",
	]);
	const action = (a: NotFoundAction | undefined, primary: boolean) => (
		<Show when={a}>
			{(act) => (
				<a
					href={act().href ?? "#"}
					class={`inline-flex h-10 items-center rounded-md px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
						primary
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "border border-border bg-transparent text-foreground hover:bg-muted"
					}`}
					onClick={(e) => {
						if (!act().href) e.preventDefault();
						act().onClick?.();
					}}
				>
					{act().label}
				</a>
			)}
		</Show>
	);
	return (
		<section
			class={`solidui-not-found-page flex flex-col items-center justify-center px-6 py-12 text-center ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "none"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${(local.fullHeight ?? true) ? "min-h-[60vh]" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.media}>
				<div class="mb-6">{local.media}</div>
			</Show>
			<div class={`font-mono font-bold tracking-tight text-primary/60 ${codeSize[local.size ?? "md"]}`}>
				{local.code ?? "404"}
			</div>
			<h1 class={`mt-4 font-semibold text-foreground ${titleSize[local.size ?? "md"]}`}>
				{local.title ?? "Page not found"}
			</h1>
			<Show when={local.message !== undefined}>
				<p class="mt-2 max-w-md text-sm text-muted-foreground">
					{local.message ?? "The page you're looking for doesn't exist or has been moved."}
				</p>
			</Show>
			<Show when={local.primaryAction || local.secondaryAction}>
				<div class="mt-6 flex gap-3">
					{action(local.primaryAction ?? { label: "Go home", href: "/" }, true)}
					{action(local.secondaryAction, false)}
				</div>
			</Show>
		</section>
	);
}
