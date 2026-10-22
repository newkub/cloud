/**
 * SelectableCard — card that behaves as a checkbox or radio input.
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

export interface SelectableCardProps extends Omit<JSX.HTMLAttributes<HTMLLabelElement>, "onChange"> {
	/** Input behaviour. @default "checkbox" */
	type?: "checkbox" | "radio";
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	name?: string;
	value?: string;
	title: string;
	description?: string;
	/** Leading icon or media element. */
	icon?: JSX.Element;
	/** Where `icon` sits relative to the text. @default "start" */
	mediaPosition?: "start" | "top" | "end";
	disabled?: boolean;
	/** Blocks toggling without dimming — the card still looks interactive. @default false */
	readOnly?: boolean;
	/** Flag the card invalid — boolean styles the border, a string also renders a message. */
	error?: boolean | string;
	/** Show the check indicator in the corner. @default true */
	showIndicator?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function SelectableCard(props: SelectableCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"type",
		"checked",
		"defaultChecked",
		"onChange",
		"name",
		"value",
		"title",
		"description",
		"icon",
		"mediaPosition",
		"disabled",
		"readOnly",
		"error",
		"showIndicator",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);

	const isRadio = () => local.type === "radio";
	const errorMsg = () => (typeof local.error === "string" ? local.error : undefined);

	return (
		<label
			class={`solidui-selectable-card relative flex gap-3 motion-safe:transition-colors motion-reduce:transition-none focus-within:ring-2 focus-within:ring-ring ${
				local.mediaPosition === "top" ? "flex-col items-start" : "items-start"
			} ${local.disabled ? "cursor-not-allowed opacity-50" : local.readOnly ? "cursor-default" : "cursor-pointer hover:border-primary/60"} ${
				surfaceVariants[local.variant ?? "default"]
			} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${
				local.error
					? "border-destructive ring-1 ring-destructive/30"
					: local.checked
						? "border-primary ring-1 ring-primary/30"
						: "border-border"
			} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			data-checked={local.checked || undefined}
			data-invalid={local.error ? true : undefined}
			{...rest}
		>
			<input
				type={local.type ?? "checkbox"}
				class="sr-only"
				checked={local.checked ?? local.defaultChecked}
				name={local.name}
				value={local.value}
				disabled={local.disabled}
				aria-readonly={local.readOnly || undefined}
				aria-invalid={local.error ? true : undefined}
				onChange={(e) => {
					if (local.readOnly) return;
					local.onChange?.(e.currentTarget.checked);
				}}
			/>
			<Show when={local.icon && local.mediaPosition !== "end"}>
				<span class={`shrink-0 text-muted-foreground ${local.mediaPosition === "top" ? "order-first" : ""}`}>
					{local.icon}
				</span>
			</Show>
			<span class="min-w-0 flex-1">
				<span class={`block font-medium text-foreground ${titleSize[local.size ?? "md"]}`}>{local.title}</span>
				<Show when={local.description}>
					<span class="mt-0.5 block text-xs text-muted-foreground">{local.description}</span>
				</Show>
				<Show when={errorMsg()}>
					<span class="mt-1 block text-xs text-destructive" role="alert">
						{errorMsg()}
					</span>
				</Show>
			</span>
			<Show when={local.icon && local.mediaPosition === "end"}>
				<span class="shrink-0 text-muted-foreground">{local.icon}</span>
			</Show>
			<Show when={local.showIndicator ?? true}>
				<span
					aria-hidden="true"
					class={`flex h-4 w-4 shrink-0 items-center justify-center border motion-safe:transition-colors motion-reduce:transition-none ${
						isRadio() ? "rounded-full" : "rounded"
					} ${local.checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent"}`}
				>
					<Show when={local.checked}>
						{isRadio() ? (
							<span class="h-1.5 w-1.5 rounded-full bg-current" />
						) : (
							<svg
								viewBox="0 0 12 12"
								class="h-2.5 w-2.5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="m2 6 3 3 5-5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						)}
					</Show>
				</span>
			</Show>
		</label>
	);
}
