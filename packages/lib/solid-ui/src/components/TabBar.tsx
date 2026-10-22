/**
 * TabBar — pill or underline tab bar with arrow-key navigation.
 * @deprecated Use `Tabs` + `TabsList` + `TabsTrigger` — compound API with
 * `variant="pills" | "underline"`, controlled/uncontrolled value and content panels.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import type { Radius } from "../lib/variants";
import { Tabs, TabsList, TabsTrigger } from "./Tabs";

export interface TabBarTab {
	/** Tab label. */
	label: string;
	/** Unique tab value passed to `onChange`. */
	value: string;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Small badge after the label. */
	badge?: string | number;
}

export interface TabBarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Tab descriptors. */
	tabs: TabBarTab[];
	/** Currently selected tab value. */
	value?: string;
	/** Called with the newly selected value. */
	onChange?: (value: string) => void;
	/** Density. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Visual style — a filled pill or an underline. @default "pills" */
	variant?: "pills" | "underline";
	/** Stretch the bar and tabs to fill the container. */
	fullWidth?: boolean;
	/** Corner radius of the bar and pill indicator. @default "lg" */
	radius?: Radius;
}

const tabSize = {
	sm: "px-2.5 py-1 text-xs",
	md: "px-3 py-1.5 text-sm",
	lg: "px-4 py-2 text-sm",
} as const;

export function TabBar(props: TabBarProps) {
	const [local, rest] = splitProps(props, ["tabs", "value", "onChange", "size", "variant", "fullWidth", "radius"]);
	return (
		<Tabs value={local.value} onValueChange={(v) => local.onChange?.(v)} radius={local.radius} {...rest}>
			<TabsList variant={local.variant} class={local.fullWidth ? "w-full" : ""} radius={local.radius}>
				<For each={local.tabs ?? []}>
					{(t) => (
						<TabsTrigger value={t.value} class={`${tabSize[local.size ?? "md"]} ${local.fullWidth ? "flex-1" : ""}`}>
							{t.icon}
							{t.label}
							<Show when={t.badge !== undefined}>
								<span class="rounded-full bg-muted px-1.5 text-2xs text-muted-foreground">{t.badge}</span>
							</Show>
						</TabsTrigger>
					)}
				</For>
			</TabsList>
		</Tabs>
	);
}
