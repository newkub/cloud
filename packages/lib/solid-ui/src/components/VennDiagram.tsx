/**
 * VennDiagram — 2 or 3 overlapping translucent circles with labels and an optional intersection label.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface VennSet {
	/** Set name rendered next to its circle. */
	label: string;
	/** Numeric size rendered inside the circle. */
	value?: number;
	/** Tone name ("primary" | "success" | "warning" | "info" | "destructive") or raw CSS color. */
	color?: string;
}

export interface VennDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Sets to draw — 2 or 3 entries. */
	sets: VennSet[];
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Label rendered at the shared center overlap. */
	intersectionLabel?: string;
}

const sizeClass = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" } as const;

const TONES = ["primary", "success", "warning"] as const;
const toneFill: Record<string, string> = {
	primary: "fill-primary/40 stroke-primary/70",
	success: "fill-success/40 stroke-success/70",
	warning: "fill-warning/40 stroke-warning/70",
	info: "fill-info/40 stroke-info/70",
	destructive: "fill-destructive/40 stroke-destructive/70",
};

const W = 420;
const H = 320;

function centers(count: number): { x: number; y: number; r: number }[] {
	const cx = W / 2;
	const cy = H / 2;
	if (count <= 2) {
		return [
			{ x: cx - 62, y: cy, r: 104 },
			{ x: cx + 62, y: cy, r: 104 },
		];
	}
	return [
		{ x: cx, y: cy - 58, r: 96 },
		{ x: cx - 56, y: cy + 40, r: 96 },
		{ x: cx + 56, y: cy + 40, r: 96 },
	];
}

export function VennDiagram(props: VennDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "sets", "size", "intersectionLabel", "aria-label"]);
	const sets = () => (local.sets ?? []).slice(0, 3);
	const geo = () => centers(sets().length);
	const label = () =>
		local["aria-label"] ??
		`Venn diagram: ${sets()
			.map((s) => s.label)
			.join(", ")}`;
	const fillFor = (s: VennSet, i: number) =>
		s.color && toneFill[s.color] ? toneFill[s.color] : s.color ? "" : toneFill[TONES[i % TONES.length]];
	const styleFor = (s: VennSet) =>
		s.color && !toneFill[s.color] ? { fill: s.color, "fill-opacity": "0.35", stroke: s.color } : undefined;

	return (
		<div class={`solidui-venn-diagram ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<svg viewBox={`0 0 ${W} ${H}`} class="h-auto w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<For each={sets()}>
					{(s, i) => {
						const c = () => geo()[i()];
						const out = () => {
							const g = c();
							const dx = g.x - W / 2;
							const dy = g.y - H / 2;
							const len = Math.hypot(dx, dy) || 1;
							return { x: g.x + (dx / len) * (g.r + 14), y: g.y + (dy / len) * (g.r + 14) };
						};
						return (
							<g>
								<circle
									cx={c().x}
									cy={c().y}
									r={c().r}
									stroke-width="1.5"
									class={fillFor(s, i())}
									style={styleFor(s)}
								/>
								<Show when={s.value !== undefined}>
									<text
										x={c().x}
										y={c().y}
										dy="0.35em"
										text-anchor="middle"
										class="fill-foreground tabular-nums"
										font-size="12"
									>
										{s.value}
									</text>
								</Show>
								<text
									x={out().x}
									y={out().y}
									dy="0.35em"
									text-anchor="middle"
									class="fill-foreground"
									font-size="12"
									font-weight="600"
								>
									{s.label}
								</text>
							</g>
						);
					}}
				</For>
				<Show when={local.intersectionLabel}>
					<text
						x={W / 2}
						y={H / 2}
						dy="0.35em"
						text-anchor="middle"
						class="fill-foreground"
						font-size="11"
						font-weight="600"
					>
						{local.intersectionLabel}
					</text>
				</Show>
			</svg>
		</div>
	);
}
