/**
 * ThemeToggle — button that switches the document between light and dark mode.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type ControlVariant, controlVariants, type Radius, radiusMap } from "../lib/variants";

export interface ThemeToggleProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	/** Controlled theme — when omitted the component manages it. */
	mode?: "light" | "dark";
	defaultMode?: "light" | "dark";
	onChange?: (mode: "light" | "dark") => void;
	/** Attribute toggled on <html>. @default "class" — adds/removes "dark" */
	strategy?: "class" | "data-theme";
	/** Show a text label next to the icon. */
	showLabel?: boolean;
	variant?: ControlVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const btnSize = { sm: "h-8 px-2 text-2xs", md: "h-9 px-3 text-sm", lg: "h-10 px-4 text-base" } as const;
const iconSize = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;

export function ThemeToggle(props: ThemeToggleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"mode",
		"defaultMode",
		"onChange",
		"strategy",
		"showLabel",
		"variant",
		"size",
		"radius",
		"disabled",
		"aria-label",
	]);
	const [internal, setInternal] = createSignal<"light" | "dark">(local.defaultMode ?? "light");
	const mode = () => local.mode ?? internal();

	const apply = (m: "light" | "dark") => {
		const root = document.documentElement;
		if ((local.strategy ?? "class") === "class") root.classList.toggle("dark", m === "dark");
		else root.dataset.theme = m;
	};
	const toggle = () => {
		const next = mode() === "dark" ? "light" : "dark";
		setInternal(next);
		apply(next);
		local.onChange?.(next);
	};

	return (
		<button
			type="button"
			disabled={local.disabled}
			aria-label={local["aria-label"] ?? `Switch to ${mode() === "dark" ? "light" : "dark"} mode`}
			class={`solidui-theme-toggle inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${controlVariants[local.variant ?? "outline"]} ${btnSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
			onClick={toggle}
			{...rest}
		>
			<Show
				when={mode() === "dark"}
				fallback={
					<svg
						class={iconSize[local.size ?? "md"]}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
							stroke-linecap="round"
						/>
					</svg>
				}
			>
				<svg
					class={iconSize[local.size ?? "md"]}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
				>
					<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</Show>
			<Show when={local.showLabel}>{mode() === "dark" ? "Dark" : "Light"}</Show>
		</button>
	);
}
