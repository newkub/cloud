/**
 * PyramidDiagram — stacked trapezoid layers forming a pyramid, with optional side labels.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface PyramidLevel {
	/** Level name. */
	label: string;
	/** Numeric value rendered after the label. */
	value?: number;
	/** Tone name ("primary" | "success" | "warning" | "info" | "destructive") or raw CSS color. */
	color?: string;
}

export interface PyramidDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Levels ordered top (apex) to bottom (base). */
	levels: PyramidLevel[];
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Render labels to the right of each layer with connector ticks. @default false */
	showLabels?: boolean;
}

const sizeClass = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" } as const;

const TONES = ["primary", "info", "success", "warning", "destructive"] as const;
const toneFill: Record<string, string> = {
	primary: "fill-primary/25 stroke-primary/60",
	success: "fill-success/25 stroke-success/60",
	warning: "fill-warning/25 stroke-warning/60",
	info: "fill-info/25 stroke-info/60",
	destructive: "fill-destructive/25 stroke-destructive/60",
};

const H = 320;
const PYR_W = 260;
const CX = 150;

export function PyramidDiagram(props: PyramidDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "levels", "size", "showLabels", "aria-label"]);
	const levels = () => local.levels ?? [];
	const W = () => (local.showLabels ? 460 : 300);
	const label = () =>
		local["aria-label"] ??
		`Pyramid diagram: ${levels()
			.map((l) => l.label)
			.join(", ")}`;

	const geo = (i: number) => {
		const n = Math.max(levels().length, 1);
		const h = H / n;
		const y0 = i * h;
		const y1 = (i + 1) * h;
		const w0 = (PYR_W / 2) * (i / n);
		const w1 = (PYR_W / 2) * ((i + 1) / n);
		return { y0, y1, w0, w1, ym: (y0 + y1) / 2, wm: (w0 + w1) / 2 };
	};

	const fillFor = (l: PyramidLevel, i: number) =>
		l.color && toneFill[l.color] ? toneFill[l.color] : l.color ? "" : toneFill[TONES[i % TONES.length]];
	const styleFor = (l: PyramidLevel) =>
		l.color && !toneFill[l.color] ? { fill: l.color, "fill-opacity": "0.3", stroke: l.color } : undefined;

	return (
		<div class={`solidui-pyramid-diagram ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<svg viewBox={`0 0 ${W()} ${H}`} class="h-auto w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<For each={levels()}>
					{(l, i) => {
						const g = () => geo(i());
						return (
							<g>
								<polygon
									points={`${CX - g().w0},${g().y0} ${CX + g().w0},${g().y0} ${CX + g().w1},${g().y1} ${CX - g().w1},${g().y1}`}
									stroke-width="1.5"
									class={fillFor(l, i())}
									style={styleFor(l)}
								/>
								<Show
									when={local.showLabels}
									fallback={
										<text x={CX} y={g().ym} dy="0.35em" text-anchor="middle" class="fill-foreground" font-size="11">
											{l.label}
											{l.value !== undefined ? ` (${l.value})` : ""}
										</text>
									}
								>
									<line
										x1={CX + g().wm}
										y1={g().ym}
										x2={CX + PYR_W / 2 + 10}
										y2={g().ym}
										class="stroke-border"
										stroke-width="1"
									/>
									<text x={CX + PYR_W / 2 + 16} y={g().ym} dy="0.35em" class="fill-foreground" font-size="11">
										{l.label}
									</text>
									<Show when={l.value !== undefined}>
										<text
											x={CX + PYR_W / 2 + 16 + l.label.length * 6.5 + 8}
											y={g().ym}
											dy="0.35em"
											class="fill-muted-foreground tabular-nums"
											font-size="11"
										>
											{l.value}
										</text>
									</Show>
								</Show>
							</g>
						);
					}}
				</For>
			</svg>
		</div>
	);
}
