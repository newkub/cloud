/**
 * DeviceFrame — phone/tablet bezel around content or screenshots.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface DeviceFrameProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Device silhouette. @default "phone" */
	device?: "phone" | "tablet";
	/** Image shown inside the screen. */
	src?: string;
	alt?: string;
	/** Screen aspect preset — "auto" lets content define the height. */
	aspect?: "auto" | "9/19.5" | "4/3" | "16/9";
	/** Show the notch/home indicator. @default true */
	notch?: boolean;
	variant?: SurfaceVariant;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Fixed frame width in px (height follows aspect). */
	width?: number;
}

const bezel = { phone: "rounded-[2.5rem] p-2", tablet: "rounded-[1.75rem] p-3" } as const;
const screenR = { phone: "rounded-[2rem]", tablet: "rounded-[1.25rem]" } as const;
const aspectMap = { auto: "", "9/19.5": "aspect-[9/19.5]", "4/3": "aspect-[4/3]", "16/9": "aspect-video" } as const;

export function DeviceFrame(props: DeviceFrameProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"device",
		"src",
		"alt",
		"aspect",
		"notch",
		"variant",
		"elevation",
		"width",
	]);
	const device = () => local.device ?? "phone";
	return (
		<div
			class={`solidui-device-frame inline-block ${bezel[device()]} ${surfaceVariants[local.variant ?? "default"]} ${
				local.elevation ? elevationMap[local.elevation] : "shadow-xl"
			} ${local.class ?? ""}`.trim()}
			style={local.width ? { width: `${local.width}px` } : undefined}
			{...rest}
		>
			<div
				class={`relative overflow-hidden bg-background ${screenR[device()]} ${aspectMap[local.aspect ?? (device() === "phone" ? "9/19.5" : "4/3")]}`}
			>
				<Show when={(local.notch ?? true) && device() === "phone"}>
					<div
						class="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90"
						aria-hidden="true"
					/>
				</Show>
				{local.src ? (
					<img src={local.src} alt={local.alt ?? ""} class="block h-full w-full object-cover" />
				) : (
					<div class="h-full w-full overflow-y-auto">{local.children}</div>
				)}
			</div>
		</div>
	);
}
