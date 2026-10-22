/**
 * BracketDiagram — single-elimination tournament bracket.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BracketMatch {
	/** Team/competitor names — 1 or 2 per match; 1 = bye/winner card. */
	teams: [string, string?];
	/** Index of the winning team (0 or 1) — bolds it. */
	winner?: 0 | 1;
}

export interface BracketDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Rounds left→right; each round's matches feed the next. */
	rounds?: { label?: string; matches: BracketMatch[] }[];
	width?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function BracketDiagram(props: BracketDiagramProps) {
	const merged = mergeProps({ width: 480 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "rounds", "width", "radius", "elevation"]);

	const view = () => {
		const rounds = local.rounds ?? [];
		const n = Math.max(1, rounds.length);
		const firstN = rounds[0]?.matches.length ?? 1;
		const rowH = 52;
		const colW = (local.width - 16) / n;
		const height = firstN * rowH + 24;
		// match centers: round r has 2^r fewer matches → spread to align
		const centers = rounds.map((r, _ri) =>
			r.matches.map((_, mi) => {
				const span = firstN / r.matches.length;
				return 24 + (mi + 0.5) * span * rowH;
			}),
		);
		return { rounds, colW, height, centers };
	};

	return (
		<div
			class={[
				"w-full overflow-x-auto",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="w-full" viewBox={`0 0 ${local.width} ${view().height}`} role="img" aria-label="Tournament bracket">
				<For each={view().rounds}>
					{(r, ri) => (
						<g>
							{r.label && (
								<text
									x={8 + ri() * view().colW + 6}
									y={12}
									font-size="8"
									class="fill-muted-foreground font-semibold uppercase"
								>
									{r.label}
								</text>
							)}
							<For each={r.matches}>
								{(m, mi) => {
									const cy = view().centers[ri()][mi()];
									const x = 8 + ri() * view().colW + 6;
									const w = view().colW - 24;
									return (
										<g>
											<rect
												x={x}
												y={cy - 20}
												width={w}
												height="40"
												rx="5"
												fill="var(--color-surface)"
												stroke="currentColor"
												class="text-border"
											/>
											<For each={m.teams}>
												{(t, ti) => (
													<text
														x={x + 6}
														y={cy - 7 + ti() * 14}
														font-size="8"
														class={m.winner === ti() ? "fill-foreground font-bold" : "fill-muted-foreground"}
													>
														{t}
													</text>
												)}
											</For>
											<line
												x1={x}
												x2={x + w}
												y1={cy}
												y2={cy}
												stroke="currentColor"
												class="text-border"
												stroke-width="0.5"
											/>
										</g>
									);
								}}
							</For>
							{/* connectors to next round */}
							{ri() < view().rounds.length - 1 && (
								<For each={r.matches}>
									{(_, mi) => {
										if (mi() % 2 === 1) return null;
										const y0 = view().centers[ri()][mi()];
										const y1 = view().centers[ri()][mi() + 1];
										const x = 8 + ri() * view().colW + 6 + view().colW - 24;
										const xNext = 8 + (ri() + 1) * view().colW + 6;
										const midX = (x + xNext) / 2;
										return (
											<path
												d={`M${x},${y0} H${midX} V${y1} H${x} M${midX},${(y0 + y1) / 2} H${xNext}`}
												fill="none"
												stroke="currentColor"
												class="text-border"
											/>
										);
									}}
								</For>
							)}
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
