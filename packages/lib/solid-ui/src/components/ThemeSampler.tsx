/**
 * ThemeSampler — row of theme swatch cards (bg/fg/primary/accent dots) with an apply button.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";

export interface ThemeSamplerColors {
	/** Background color (any CSS color) */
	bg: string;
	/** Foreground/text color */
	fg: string;
	/** Primary action color */
	primary: string;
	/** Accent color */
	accent: string;
}

export interface ThemeSamplerTheme {
	/** Theme name */
	name: string;
	/** Palette shown as swatch dots */
	colors: ThemeSamplerColors;
}

export interface ThemeSamplerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Themes to sample */
	themes: ThemeSamplerTheme[];
	/** Called with the theme when its apply button is clicked */
	onApply?: (theme: ThemeSamplerTheme) => void;
	/** Name of the theme applied externally */
	applied?: string;
}

const swatchKeys = ["bg", "fg", "primary", "accent"] as const;

export function ThemeSampler(props: ThemeSamplerProps) {
	const [local, rest] = splitProps(props, ["class", "themes", "onApply", "applied"]);
	const [picked, setPicked] = createSignal<string | undefined>(local.applied);
	const active = (name: string) => (local.applied ?? picked()) === name;
	const apply = (theme: ThemeSamplerTheme) => {
		setPicked(theme.name);
		local.onApply?.(theme);
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic swatch group, not a form fieldset
		<div
			class={`solidui-theme-sampler flex flex-wrap items-stretch gap-2 ${local.class ?? ""}`.trim()}
			role="group"
			aria-label="Theme samples"
			{...rest}
		>
			<For each={local.themes ?? []}>
				{(theme) => (
					<div
						class={`flex w-36 flex-col gap-2 rounded-lg border p-3 ${
							active(theme.name) ? "border-primary bg-primary/5" : "border-border bg-surface"
						}`}
					>
						<p class="truncate text-xs font-semibold text-foreground">{theme.name}</p>
						<div class="flex items-center gap-1" role="img" aria-label={`${theme.name} palette`}>
							<For each={swatchKeys}>
								{(key) => (
									<span
										class="h-4 w-4 rounded-full border border-border"
										style={{ "background-color": theme.colors[key] }}
										title={`${key}: ${theme.colors[key]}`}
									/>
								)}
							</For>
						</div>
						<button
							type="button"
							class={`h-7 rounded-md text-2xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
								active(theme.name)
									? "border border-success/30 bg-success/10 text-success"
									: "bg-primary text-primary-foreground hover:bg-primary/90"
							}`}
							aria-pressed={active(theme.name)}
							onClick={() => apply(theme)}
						>
							{active(theme.name) ? "Applied" : "Apply"}
						</button>
					</div>
				)}
			</For>
		</div>
	);
}
