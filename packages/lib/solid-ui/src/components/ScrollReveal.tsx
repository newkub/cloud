/**
 * ScrollReveal - fades/slides children in when they enter the viewport.
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";

export interface ScrollRevealProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Intersection ratio needed to reveal. @default 0.15 */
	threshold?: number;
	/** Reveal only once. @default true */
	once?: boolean;
	/** Starting offset direction. @default "up" */
	from?: "up" | "down" | "left" | "right" | "none";
	/** Transition duration in ms. @default 500 */
	duration?: number;
}

export function ScrollReveal(props: ScrollRevealProps) {
	const [local, rest] = splitProps(props, ["class", "threshold", "once", "from", "duration", "children"]);
	const [shown, setShown] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						setShown(true);
						if (local.once ?? true) observer.disconnect();
					} else if (!(local.once ?? true)) {
						setShown(false);
					}
				}
			},
			{ threshold: local.threshold ?? 0.15 },
		);
		if (root) observer.observe(root);
		onCleanup(() => observer.disconnect());
	});

	const offset = () => {
		switch (local.from ?? "up") {
			case "up":
				return "translateY(16px)";
			case "down":
				return "translateY(-16px)";
			case "left":
				return "translateX(16px)";
			case "right":
				return "translateX(-16px)";
			default:
				return "none";
		}
	};

	const className = () =>
		["solidui-scroll-reveal transition-all motion-reduce:transition-none", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div
			ref={root}
			class={className()}
			style={{
				opacity: shown() ? "1" : "0",
				transform: shown() ? "none" : offset(),
				"transition-duration": `${local.duration ?? 500}ms`,
			}}
			{...rest}
		>
			{local.children}
		</div>
	);
}
