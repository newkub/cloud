/**
 * PasswordStrength — strength meter driven by composable rules.
 */
import { createEffect, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface StrengthRule {
	key: string;
	label: string;
	/** Pass when the rule is satisfied. */
	test: (value: string) => boolean;
}

export const DEFAULT_STRENGTH_RULES: StrengthRule[] = [
	{ key: "length", label: "8+ characters", test: (v) => v.length >= 8 },
	{ key: "lower", label: "Lowercase", test: (v) => /[a-z]/.test(v) },
	{ key: "upper", label: "Uppercase", test: (v) => /[A-Z]/.test(v) },
	{ key: "digit", label: "Number", test: (v) => /\d/.test(v) },
	{ key: "symbol", label: "Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export interface PasswordStrengthProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Password to evaluate. */
	value: string;
	/** Rules — defaults to the 5 standard ones. */
	rules?: StrengthRule[];
	/** Number of bar segments / score steps. @default 4 */
	levels?: number;
	/** Rule checklist under the bar. @default true */
	showFeedback?: boolean;
	/** Strength label text ("Weak"…). @default true */
	showLabel?: boolean;
	/** Label overrides by score 0–4. */
	labels?: string[];
	/** Called whenever the computed score changes. */
	onScoreChange?: (score: number) => void;
	size?: "sm" | "md" | "lg";
	/** Bar corner radius. */
	radius?: Radius;
}

const barH = { sm: "h-1", md: "h-1.5", lg: "h-2" } as const;
const DEFAULT_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const barColor = ["bg-destructive", "bg-destructive/70", "bg-warning", "bg-success/70", "bg-success"];

export function PasswordStrength(props: PasswordStrengthProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"rules",
		"levels",
		"showFeedback",
		"showLabel",
		"labels",
		"onScoreChange",
		"size",
		"radius",
	]);
	const rules = () => local.rules ?? DEFAULT_STRENGTH_RULES;
	const levels = () => Math.max(1, local.levels ?? 4);
	const passed = () => rules().map((r) => r.test(local.value ?? ""));
	const score = () =>
		local.value
			? Math.min(
					levels(),
					Math.max(
						0,
						Math.round((passed().filter(Boolean).length / rules().length) * levels()) -
							1 +
							((local.value ?? "").length >= 12 ? 1 : 0),
					),
				)
			: 0;
	const labels = () => local.labels ?? DEFAULT_LABELS;
	const labelIndex = () => Math.round((score() / levels()) * (labels().length - 1));
	const label = () => labels()[labelIndex()];
	const colorIndex = () => Math.round((score() / levels()) * (barColor.length - 1));

	createEffect(() => {
		local.onScoreChange?.(score());
	});

	return (
		<div class={`solidui-password-strength ${local.class ?? ""}`.trim()} {...rest}>
			{/* biome-ignore lint/a11y/useSemanticElements: styled segments need div, not meter */}
			<div
				class={`flex gap-1 ${barH[local.size ?? "md"]}`}
				role="meter"
				aria-valuenow={score()}
				aria-valuemin={0}
				aria-valuemax={levels()}
				aria-label={`Password strength: ${label()}`}
			>
				<For each={Array.from({ length: levels() }, (_, i) => i)}>
					{(i) => (
						<span
							class={`flex-1 motion-safe:transition-colors ${radiusMap[local.radius ?? "full"]} ${i <= score() - (score() === 0 && !local.value ? 1 : 0) && local.value ? barColor[colorIndex()] : "bg-muted"}`}
						/>
					)}
				</For>
			</div>
			<Show when={(local.showLabel ?? true) && local.value}>
				<div
					class={`mt-1 font-medium ${barColor[colorIndex()].replace("bg-", "text-")} ${local.size === "sm" ? "text-2xs" : "text-xs"}`}
				>
					{label()}
				</div>
			</Show>
			<Show when={local.showFeedback ?? true}>
				<ul class="mt-1.5 space-y-0.5">
					<For each={rules()}>
						{(r, i) => (
							<li
								class={`flex items-center gap-1.5 text-2xs ${passed()[i()] ? "text-success" : "text-muted-foreground"}`}
							>
								<svg
									class="h-2.5 w-2.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									aria-hidden="true"
								>
									{passed()[i()] ? (
										<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
									) : (
										<circle cx="12" cy="12" r="8" />
									)}
								</svg>
								{r.label}
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
