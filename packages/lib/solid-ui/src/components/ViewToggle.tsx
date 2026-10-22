/**
 * ViewToggle - segmented switch between view modes (e.g. grid / list).
 */
import { For, type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ViewOption {
	/** Option id. */
	id: string;
	/** Accessible label. */
	label: string;
	/** Icon name from the internal icon set, or custom JSX. */
	icon?: JSX.Element | string;
}

export interface ViewToggleProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Available views. */
	options: ViewOption[];
	/** Active view id. */
	value?: string;
	/** Called with the picked view id. */
	onChange?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function ViewToggle(props: ViewToggleProps) {
	const [local, rest] = splitProps(props, ["class", "options", "value", "onChange", "radius"]);

	const className = () =>
		[
			"solidui-view-toggle inline-flex items-center border border-input bg-muted p-0.5",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: segmented control, not a form fieldset
		<div class={className()} role="group" aria-label="View mode" {...rest}>
			<For each={local.options}>
				{(opt) => {
					const active = () => local.value === opt.id;
					return (
						<button
							type="button"
							class={`inline-flex h-7 w-7 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]} ${
								active() ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
							}`}
							aria-label={opt.label}
							aria-pressed={active()}
							title={opt.label}
							onClick={() => local.onChange?.(opt.id)}
						>
							{typeof opt.icon === "string" ? <NamedIcon name={opt.icon} class="h-4 w-4" /> : (opt.icon ?? opt.label)}
						</button>
					);
				}}
			</For>
		</div>
	);
}
