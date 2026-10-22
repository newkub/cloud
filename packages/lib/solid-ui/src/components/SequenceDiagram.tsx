/**
 * SequenceDiagram — actors with lifelines and ordered messages, Mermaid-style.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SequenceMessage {
	/** Sender actor id */
	from: string;
	/** Receiver actor id */
	to: string;
	/** Message label */
	label?: string;
	/** Dashed line for return/async messages */
	dashed?: boolean;
}

export interface SequenceDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Actor ids — rendered left to right as lifelines */
	actors: string[];
	/** Ordered messages between actors */
	messages: SequenceMessage[];
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

const COL_W = 150;
const ROW_H = 44;
const HEAD_H = 40;
const PAD = 16;

export function SequenceDiagram(props: SequenceDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "actors", "messages", "size", "radius", "elevation"]);
	const colX = (i: number) => PAD + i * COL_W + COL_W / 2;
	const actors = () => local.actors ?? [];
	const messages = () => local.messages ?? [];
	const height = () => HEAD_H + messages().length * ROW_H + PAD * 2;
	const width = () => actors().length * COL_W + PAD * 2;
	return (
		<div
			class={`solidui-sequence-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${width()} ${height()}`}
				class="h-auto w-full"
				role="img"
				aria-label={`Sequence diagram: ${actors().join(", ")} — ${messages().length} messages`}
			>
				<For each={actors()}>
					{(actor, i) => (
						<g>
							<rect
								x={PAD + i() * COL_W + 12}
								y={PAD}
								width={COL_W - 24}
								height={HEAD_H - 10}
								rx={6}
								class="fill-primary/10 stroke-primary/50"
							/>
							<text
								x={colX(i())}
								y={PAD + (HEAD_H - 10) / 2}
								dy="0.35em"
								text-anchor="middle"
								class="fill-foreground"
								font-size="11"
								font-weight="600"
							>
								{actor}
							</text>
							<line
								x1={colX(i())}
								y1={PAD + HEAD_H}
								x2={colX(i())}
								y2={height() - PAD}
								class="stroke-border"
								stroke-dasharray="4 4"
							/>
						</g>
					)}
				</For>
				<For each={messages()}>
					{(m, i) => {
						const fi = () => actors().indexOf(m.from);
						const ti = () => actors().indexOf(m.to);
						const y = () => PAD + HEAD_H + i() * ROW_H + ROW_H / 2;
						const self = () => fi() === ti();
						const x1 = () => colX(Math.min(fi(), ti()));
						const x2 = () => colX(Math.max(fi(), ti()));
						return (
							<Show when={fi() >= 0 && ti() >= 0}>
								<g>
									<Show
										when={!self()}
										fallback={
											<path
												d={`M ${x1()} ${y()} h 24 v 14 h -24`}
												fill="none"
												class="stroke-muted-foreground"
												stroke-width="1.5"
											/>
										}
									>
										<line
											x1={colX(fi())}
											y1={y()}
											x2={x2()}
											y2={y()}
											class="stroke-muted-foreground"
											stroke-width="1.5"
											stroke-dasharray={m.dashed ? "5 4" : undefined}
											marker-end="url(#su-seq-arrow)"
										/>
									</Show>
									<Show when={m.label}>
										<text
											x={self() ? x1() + 16 : (x1() + x2()) / 2}
											y={y() - 5}
											text-anchor="middle"
											class="fill-muted-foreground"
											font-size="10"
										>
											{m.label}
										</text>
									</Show>
								</g>
							</Show>
						);
					}}
				</For>
				<defs>
					<marker id="su-seq-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
					</marker>
				</defs>
			</svg>
		</div>
	);
}
