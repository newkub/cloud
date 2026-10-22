/**
 * Confetti - lightweight CSS confetti burst rendered inside its container.
 */
import { For, type JSX, onCleanup, onMount, splitProps } from "solid-js";

export interface ConfettiProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Number of pieces. @default 40 */
	count?: number;
	/** Burst duration in ms; pieces are removed after. @default 1600 */
	duration?: number;
	/** CSS colors used by pieces. */
	colors?: string[];
}

const DEFAULT_COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export function Confetti(props: ConfettiProps) {
	const [local, rest] = splitProps(props, ["class", "count", "duration", "colors"]);
	const colors = () => local.colors ?? DEFAULT_COLORS;
	const count = () => local.count ?? 40;

	// deterministic pseudo-random per index
	const piece = (i: number) => {
		const rand = (seed: number) => {
			const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
			return x - Math.floor(x);
		};
		return {
			left: rand(1) * 100,
			delay: rand(2) * 0.3,
			color: colors()[Math.floor(rand(3) * colors().length)],
			rotate: rand(4) * 360,
			drift: (rand(5) - 0.5) * 120,
		};
	};

	let root: HTMLDivElement | undefined;
	onMount(() => {
		const t = setTimeout(() => root?.remove(), local.duration ?? 1600);
		onCleanup(() => clearTimeout(t));
	});

	const className = () =>
		["solidui-confetti pointer-events-none absolute inset-0 overflow-hidden", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div ref={root} class={className()} aria-hidden="true" {...rest}>
			<For each={Array.from({ length: count() }, (_, i) => i)}>
				{(i) => {
					const p = piece(i);
					return (
						<span
							class="absolute top-0 h-2 w-1.5 rounded-sm motion-safe:animate-[su-fade-in_200ms_ease-out]"
							style={{
								left: `${p.left}%`,
								"background-color": p.color,
								transform: `translateY(0) rotate(${p.rotate}deg)`,
								animation: `su-confetti-fall ${(local.duration ?? 1600) / 1000}s ease-in ${p.delay}s forwards`,
								"--su-confetti-drift": `${p.drift}px`,
							}}
						/>
					);
				}}
			</For>
			<style>{`@keyframes su-confetti-fall { to { transform: translateY(110%) translateX(var(--su-confetti-drift, 0px)) rotate(720deg); opacity: 0; } }`}</style>
		</div>
	);
}
