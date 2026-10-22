/**
 * CursorTrail — pointer-following overlay that spawns fading dots along the cursor path.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import type { TextVariant } from "../lib/variants";

const dotVariants: Record<TextVariant, string> = {
	default: "bg-foreground",
	muted: "bg-muted-foreground",
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	info: "bg-info",
};

interface Dot {
	id: number;
	x: number;
	y: number;
	fading: boolean;
}

export interface CursorTrailProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Minimum px between spawned dots. @default 24 */
	density?: number;
	/** Dot color tone (semantic token). @default "primary" */
	color?: TextVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const FADE_DELAY_MS = 30;
const REMOVE_MS = 550;

export function CursorTrail(props: CursorTrailProps) {
	const [local, pass] = splitProps(props, ["density", "color", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "pointer-events-none fixed inset-0 z-tooltip",
		unstyled: props.unstyled,
	});
	const [enabled, setEnabled] = createSignal(false);
	const [dots, setDots] = createSignal<Dot[]>([]);
	let nextId = 0;
	let last: { x: number; y: number } | undefined;
	const timers = new Set<ReturnType<typeof setTimeout>>();

	const later = (ms: number, fn: () => void) => {
		const t = setTimeout(() => {
			timers.delete(t);
			fn();
		}, ms);
		timers.add(t);
	};

	onMount(() => {
		const mm = typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia : undefined;
		// Disabled on coarse (touch) pointers and when reduced motion is requested.
		if (mm?.("(pointer: coarse)").matches || mm?.("(prefers-reduced-motion: reduce)").matches) return;
		setEnabled(true);
		const onMove = (e: PointerEvent | MouseEvent) => {
			const x = e.clientX;
			const y = e.clientY;
			if (typeof x !== "number" || typeof y !== "number" || Number.isNaN(x) || Number.isNaN(y)) return;
			if (last && Math.hypot(x - last.x, y - last.y) < (local.density ?? 24)) return;
			last = { x, y };
			const id = nextId++;
			setDots((prev) => [...prev.slice(-60), { id, x, y, fading: false }]);
			later(FADE_DELAY_MS, () => setDots((prev) => prev.map((d) => (d.id === id ? { ...d, fading: true } : d))));
			later(REMOVE_MS, () => setDots((prev) => prev.filter((d) => d.id !== id)));
		};
		window.addEventListener("pointermove", onMove);
		onCleanup(() => {
			window.removeEventListener("pointermove", onMove);
			for (const t of timers) clearTimeout(t);
			timers.clear();
		});
	});

	return (
		<div class={className()} aria-hidden="true" {...rest}>
			<For each={enabled() ? dots() : []}>
				{(dot) => (
					<span
						class={`solidui-cursor-trail-dot absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500 ease-out motion-reduce:transition-none ${dotVariants[local.color ?? "primary"]} ${
							dot.fading ? "opacity-0" : "opacity-70"
						}`}
						style={{ left: `${dot.x}px`, top: `${dot.y}px` }}
					/>
				)}
			</For>
		</div>
	);
}
