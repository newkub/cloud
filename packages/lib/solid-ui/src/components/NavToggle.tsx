/**
 * NavToggle — animated hamburger button whose three lines morph into an X when open.
 */
import { type JSX, splitProps } from "solid-js";

export interface NavToggleProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onToggle"> {
	/** Open state — morphs the bars into an X. @default false */
	open?: boolean;
	/** Called with the next open state. */
	onToggle?: (open: boolean) => void;
	/** Density. @default "md" */
	size?: "sm" | "md" | "lg";
}

const boxSize = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-10 w-10" } as const;
const barWidth = { sm: "w-4", md: "w-5", lg: "w-6" } as const;

export function NavToggle(props: NavToggleProps) {
	const [local, rest] = splitProps(props, ["class", "open", "onToggle", "size", "aria-label"]);
	const open = () => local.open ?? false;
	const bar = (cls: string) => (
		<span
			aria-hidden="true"
			class={`block h-0.5 ${barWidth[local.size ?? "md"]} rounded-full bg-current transition-all motion-reduce:transition-none ${cls}`}
		/>
	);
	return (
		<button
			type="button"
			class={`solidui-nav-toggle inline-flex flex-col items-center justify-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${boxSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			aria-label={local["aria-label"] ?? "Toggle navigation"}
			aria-expanded={open()}
			onClick={() => local.onToggle?.(!open())}
			{...rest}
		>
			{bar(open() ? "translate-y-2 rotate-45" : "")}
			{bar(open() ? "scale-x-0 opacity-0" : "")}
			{bar(open() ? "-translate-y-2 -rotate-45" : "")}
		</button>
	);
}
