/**
 * FeatureFlagRow - labelled toggle row for feature flags / settings switches.
 */
import { type JSX, splitProps } from "solid-js";
import { Switch } from "./Switch";

export interface FeatureFlagRowProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onToggle"> {
	/** Flag name. */
	label: string;
	/** Optional description under the label. */
	description?: string;
	/** Enabled state. */
	enabled?: boolean;
	/** Called with the next state. */
	onToggle?: (enabled: boolean) => void;
	/** Beta tag chip. @default false */
	beta?: boolean;
}

export function FeatureFlagRow(props: FeatureFlagRowProps) {
	const [local, rest] = splitProps(props, ["class", "label", "description", "enabled", "onToggle", "beta"]);

	const className = () =>
		["solidui-feature-flag-row flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<span class="flex-1 min-w-0">
				<span class="flex items-center gap-2 text-sm font-medium text-foreground">
					{local.label}
					{local.beta ? (
						<span class="rounded-full bg-info/15 px-1.5 py-0.5 text-[10px] font-medium text-info">BETA</span>
					) : null}
				</span>
				{local.description ? <span class="block text-xs text-muted-foreground">{local.description}</span> : null}
			</span>
			<Switch checked={local.enabled ?? false} onChange={(v) => local.onToggle?.(v)} />
		</div>
	);
}
