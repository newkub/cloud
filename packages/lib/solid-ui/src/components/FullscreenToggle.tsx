/**
 * FullscreenToggle - button that toggles document fullscreen mode.
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";

export interface FullscreenToggleProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Icon size class override. */
	iconClass?: string;
}

export function FullscreenToggle(props: FullscreenToggleProps) {
	const [local, rest] = splitProps(props, ["class", "iconClass", "onClick"]);
	const [active, setActive] = createSignal(false);

	onMount(() => {
		const sync = () => setActive(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", sync);
		onCleanup(() => document.removeEventListener("fullscreenchange", sync));
	});

	const toggle = (e: MouseEvent) => {
		if (document.fullscreenElement) void document.exitFullscreen();
		else void document.documentElement.requestFullscreen?.();
		(local.onClick as ((ev: MouseEvent) => void) | undefined)?.(e);
	};

	return (
		<button
			type="button"
			class={`solidui-fullscreen-toggle inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${local.class ?? ""}`}
			aria-label={active() ? "Exit fullscreen" : "Enter fullscreen"}
			aria-pressed={active()}
			onClick={toggle}
			{...rest}
		>
			<NamedIcon name={active() ? "minimize" : "maximize"} class={local.iconClass ?? "h-4 w-4"} />
		</button>
	);
}
