/**
 * CardStack — stacked cards; click/arrow cycles the top card to the back.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface StackCard {
	id: string;
	content: JSX.Element;
}

export interface CardStackProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	cards: StackCard[];
	/** Visible depth behind the top card. @default 3 */
	depth?: number;
	/** Show dots + prev/next controls. @default true */
	controls?: boolean;
	onChange?: (index: number) => void;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius on cards. */
	radius?: Radius;
	/** Shadow elevation on cards. */
	elevation?: Elevation;
}

const w = { sm: "w-48", md: "w-64", lg: "w-80" } as const;
const h = { sm: "h-32", md: "h-40", lg: "h-52" } as const;

export function CardStack(props: CardStackProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"cards",
		"depth",
		"controls",
		"onChange",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [top, setTop] = createSignal(0);
	const go = (dir: 1 | -1) => {
		const next = (top() + dir + cards().length) % Math.max(1, cards().length);
		setTop(next);
		local.onChange?.(next);
	};
	const cards = () => local.cards ?? [];
	const order = () =>
		cards()
			.map((_, i) => (top() + i) % cards().length)
			.slice(0, local.depth ?? 3);
	const btn = (dir: 1 | -1, label: string) => (
		<button
			type="button"
			aria-label={label}
			class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			onClick={() => go(dir)}
		>
			<svg
				class="h-3.5 w-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				{dir === -1 ? (
					<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
				) : (
					<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
				)}
			</svg>
		</button>
	);

	return (
		<div class={`solidui-card-stack inline-flex flex-col items-center gap-3 ${local.class ?? ""}`.trim()} {...rest}>
			<div class={`relative ${w[local.size ?? "md"]} ${h[local.size ?? "md"]}`}>
				<For each={order()}>
					{(cardIdx, pos) => (
						// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: role/label applied only to the top card
						<div
							class={`absolute inset-0 border transition-all motion-reduce:transition-none ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : "shadow-md"} ${pos() === 0 ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : "pointer-events-none"}`}
							style={{
								transform: `translateY(${pos() * -8}px) scale(${1 - pos() * 0.05})`,
								"z-index": 10 - pos(),
								opacity: `${1 - pos() * 0.15}`,
							}}
							role={pos() === 0 ? "button" : undefined}
							tabIndex={pos() === 0 ? 0 : undefined}
							aria-label={pos() === 0 ? "Next card" : undefined}
							onClick={() => pos() === 0 && go(1)}
							onKeyDown={(e) => {
								if (pos() === 0 && (e.key === "Enter" || e.key === " ")) {
									e.preventDefault();
									go(1);
								}
							}}
						>
							{cards()[cardIdx]?.content}
						</div>
					)}
				</For>
			</div>
			<Show when={(local.controls ?? true) && cards().length > 1}>
				<div class="flex items-center gap-2">
					{btn(-1, "Previous card")}
					<span class="text-2xs tabular-nums text-muted-foreground">
						{top() + 1} / {cards().length}
					</span>
					{btn(1, "Next card")}
				</div>
			</Show>
		</div>
	);
}
