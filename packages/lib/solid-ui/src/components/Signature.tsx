/**
 * Signature — signature line block (handwritten text/image + name + role + date).
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SignatureProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "role"> {
	/** Signed name shown under the line. */
	name: string;
	/** Job title / role line. */
	role?: string;
	/** Signed date (pre-formatted). */
	date?: string;
	/** Signature image URL — rendered above the line. */
	image?: string;
	/** Handwritten text instead of an image — italic serif. */
	signature?: string;
	/** Line label. @default "Signature" */
	label?: string;
	size?: "sm" | "md" | "lg";
	/** Line corner radius — mostly visual. */
	radius?: Radius;
}

const lineW = { sm: "w-32", md: "w-44", lg: "w-56" } as const;
const nameSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function Signature(props: SignatureProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"role",
		"date",
		"image",
		"signature",
		"label",
		"size",
		"radius",
	]);
	return (
		<div class={`solidui-signature inline-flex flex-col ${local.class ?? ""}`.trim()} {...rest}>
			<div class={`flex h-12 items-end justify-center ${lineW[local.size ?? "md"]}`}>
				<Show when={local.image}>
					<img src={local.image} alt={`Signature of ${local.name}`} class="max-h-full object-contain" />
				</Show>
				<Show when={!local.image && local.signature}>
					<span
						class="font-serif text-xl italic text-foreground"
						style={{ "font-family": "'Brush Script MT', cursive" }}
					>
						{local.signature}
					</span>
				</Show>
			</div>
			<div
				class={`mt-1 border-t-2 border-foreground/60 pt-1 ${lineW[local.size ?? "md"]} ${radiusMap[local.radius ?? "none"]}`}
			>
				<div class={`font-semibold text-foreground ${nameSize[local.size ?? "md"]}`}>{local.name}</div>
				<Show when={local.role}>
					<div class="text-2xs text-muted-foreground">{local.role}</div>
				</Show>
				<div class="mt-0.5 flex justify-between text-2xs text-muted-foreground">
					<span>{local.label ?? "Signature"}</span>
					<Show when={local.date}>
						<span class="tabular-nums">{local.date}</span>
					</Show>
				</div>
			</div>
		</div>
	);
}
