/**
 * Avatar with image and fallback
 */
import { type Accessor, createContext, createSignal, type JSX, Show, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

interface AvatarContextValue {
	src?: string;
	alt?: string;
	fallback?: JSX.Element;
	error: Accessor<boolean>;
	setError: (value: boolean) => void;
}

const AvatarContext = createContext<AvatarContextValue>();

const avatarVariants = {
	circle: "rounded-full",
	square: "rounded-none",
	rounded: "rounded-md",
} as const;

const avatarSizes = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-12 w-12",
	xl: "h-16 w-16",
} as const;

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	src?: string;
	alt?: string;
	fallback?: JSX.Element;
	variant?: keyof typeof avatarVariants;
	size?: keyof typeof avatarSizes;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Avatar(props: AvatarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"src",
		"alt",
		"fallback",
		"children",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [error, setError] = createSignal(false);

	const className = () =>
		[
			"relative flex shrink-0 overflow-hidden bg-muted",
			avatarVariants[local.variant ?? "circle"],
			avatarSizes[local.size ?? "md"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<AvatarContext.Provider value={{ src: local.src, alt: local.alt, fallback: local.fallback, error, setError }}>
			<div class={className()} {...rest}>
				{local.children ?? (
					<>
						<AvatarImage />
						<AvatarFallback />
					</>
				)}
			</div>
		</AvatarContext.Provider>
	);
}

export interface AvatarImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AvatarImage(props: AvatarImageProps) {
	const ctx = useContext(AvatarContext);
	const [local, rest] = splitProps(props, ["class", "src", "radius", "elevation"]);

	if (!ctx) {
		throw new Error("AvatarImage must be used inside an Avatar.");
	}

	const className = () =>
		[
			"aspect-square h-full w-full object-cover",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const src = () => local.src ?? ctx.src;

	return (
		<Show when={src() && !ctx.error()}>
			<img class={className()} src={src()} alt={ctx.alt ?? ""} onError={() => ctx.setError(true)} {...rest} />
		</Show>
	);
}

export interface AvatarFallbackProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	children?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AvatarFallback(props: AvatarFallbackProps) {
	const ctx = useContext(AvatarContext);
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);

	if (!ctx) {
		throw new Error("AvatarFallback must be used inside an Avatar.");
	}

	const className = () =>
		[
			"absolute inset-0 flex h-full w-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground",
			radiusMap[local.radius ?? "full"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={ctx.error() || !ctx.src}>
			<span class={className()} {...rest}>
				{local.children ?? ctx.fallback}
			</span>
		</Show>
	);
}
