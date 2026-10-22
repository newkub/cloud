/**
 * StampCard - postage-stamp panel with radial-gradient perforated edges and centered content.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StampCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Face value, e.g. "$1.20" or 42. */
	value?: string | number;
	/** Caption under the value. */
	label?: string;
	/** Stamp artwork URL. */
	src?: string;
	/** Image alt text — defaults to `label`. */
	alt?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

/** Perforated stamp edge — a tiled radial-gradient mask punches holes along the border. */
const perfMask: JSX.CSSProperties = {
	"mask-image": "radial-gradient(circle 4px at 4px 4px, transparent 3.5px, black 4px)",
	"-webkit-mask-image": "radial-gradient(circle 4px at 4px 4px, transparent 3.5px, black 4px)",
	"mask-position": "-4px -4px",
	"-webkit-mask-position": "-4px -4px",
	"mask-size": "10px 10px",
	"-webkit-mask-size": "10px 10px",
	"mask-repeat": "repeat",
	"-webkit-mask-repeat": "repeat",
};

export function StampCard(props: StampCardProps) {
	const [local, restProps] = splitProps(props, ["children", "value", "label", "src", "alt", "style"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-stamp-card inline-block bg-card text-card-foreground",
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap, default: "sm" },
		],
	});

	const mergedStyle = (): JSX.CSSProperties | string => {
		const s = local.style;
		if (typeof s === "string")
			return `${s};${Object.entries(perfMask)
				.map(([k, v]) => `${k}:${v}`)
				.join(";")}`;
		return { ...perfMask, ...(s ?? {}) };
	};

	return (
		<div class={className()} style={mergedStyle()} {...rest}>
			<div class="m-2 flex flex-col items-center justify-center gap-1 border border-dashed border-border/70 px-5 py-4 text-center">
				<Show when={local.src}>
					<img src={local.src} alt={local.alt ?? local.label ?? ""} class="h-10 w-10 object-cover" />
				</Show>
				<Show when={local.value !== undefined}>
					<div class="font-mono text-lg font-bold tabular-nums leading-tight">{local.value}</div>
				</Show>
				<Show when={local.label}>
					<div class="text-2xs uppercase tracking-widest text-muted-foreground">{local.label}</div>
				</Show>
				{local.children}
			</div>
		</div>
	);
}
