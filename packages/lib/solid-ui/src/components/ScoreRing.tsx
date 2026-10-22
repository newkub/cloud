/**
 * ScoreRing — circular score ring with auto/computed letter grade.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface ScoreRingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Score value, clamped to 0–100 */
	value: number;
	/** Ring diameter in px @default 96 */
	size?: number;
	/** Stroke thickness in px @default 8 */
	thickness?: number;
	/** Caption under the ring */
	label?: string;
	/** Letter grade — "auto" derives A/B/C/D from value @default "auto" */
	grade?: "auto" | string;
	/** Show numeric value inside the ring @default true */
	showValue?: boolean;
	/** Ring accent token — "auto" follows the grade @default "auto" */
	color?: "auto" | "primary" | "success" | "warning" | "destructive" | "info";
}

const strokeColor = {
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
} as const;

function autoGrade(value: number): string {
	if (value >= 90) return "A";
	if (value >= 75) return "B";
	if (value >= 60) return "C";
	return "D";
}

function gradeColor(grade: string): keyof typeof strokeColor {
	switch (grade.toUpperCase()) {
		case "A":
			return "success";
		case "B":
			return "info";
		case "C":
			return "warning";
		default:
			return "destructive";
	}
}

export function ScoreRing(props: ScoreRingProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"size",
		"thickness",
		"label",
		"grade",
		"showValue",
		"color",
	]);
	const size = () => local.size ?? 96;
	const thickness = () => local.thickness ?? 8;
	const clamped = () => Math.max(0, Math.min(100, local.value));
	const grade = () => (local.grade === "auto" || local.grade === undefined ? autoGrade(clamped()) : local.grade);
	const color = () => (local.color === "auto" || local.color === undefined ? gradeColor(grade()) : local.color);
	const radius = () => (size() - thickness()) / 2;
	const circumference = () => 2 * Math.PI * radius();
	const dashOffset = () => circumference() - (clamped() / 100) * circumference();
	const ariaLabel = () => `Score ${clamped()} out of 100, grade ${grade()}`;

	return (
		<div class={`solidui-score-ring inline-flex flex-col items-center gap-1.5 ${local.class ?? ""}`.trim()} {...rest}>
			<div class="relative inline-flex items-center justify-center">
				<svg
					role="img"
					aria-label={ariaLabel()}
					width={size()}
					height={size()}
					viewBox={`0 0 ${size()} ${size()}`}
					fill="none"
				>
					<title>{ariaLabel()}</title>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class="text-muted"
						stroke="currentColor"
						stroke-width={thickness()}
						fill="none"
					/>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class={`${strokeColor[color()]} transition-[stroke-dashoffset] motion-reduce:transition-none`}
						stroke="currentColor"
						stroke-width={thickness()}
						stroke-linecap="round"
						stroke-dasharray={String(circumference())}
						stroke-dashoffset={dashOffset()}
						transform={`rotate(-90 ${size() / 2} ${size() / 2})`}
						fill="none"
					/>
				</svg>
				<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
					<Show when={local.showValue ?? true}>
						<span class="font-bold tabular-nums text-foreground" style={{ "font-size": `${size() / 4}px` }}>
							{clamped()}
						</span>
					</Show>
					<span
						class={`font-semibold uppercase leading-none ${strokeColor[color()]}`}
						style={{ "font-size": `${Math.max(10, size() / 7)}px` }}
					>
						{grade()}
					</span>
				</div>
			</div>
			<Show when={local.label}>
				<span class="text-xs font-medium text-muted-foreground">{local.label}</span>
			</Show>
		</div>
	);
}
