/**
 * FormulaInput — math expression input with variable highlighting and validation.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface FormulaVariable {
	name: string;
	/** Sample/current value shown in the hint row. */
	value?: number;
	description?: string;
}

/** An insertable suggestion token — function or constant (e.g. `sqrt(`). */
export interface FormulaSuggestion {
	/** Token text inserted at the caret. */
	token: string;
	/** Optional label override for the chip. */
	label?: string;
	description?: string;
}

export interface FormulaInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput"> {
	value?: string;
	onChange?: (expression: string) => void;
	/** Declared variables — unknown names are flagged invalid. */
	variables?: FormulaVariable[];
	/** Extra insertable tokens (functions/constants) shown as a suggestion row. */
	suggestions?: FormulaSuggestion[];
	/** Insert-variable hint row. @default true */
	showVariables?: boolean;
	/** Show the suggestions row. @default true */
	showSuggestions?: boolean;
	/** Evaluate the expression and show the result. @default true */
	showResult?: boolean;
	/** External error — boolean styles the field, a string renders a message. */
	error?: boolean | string;
	/** Prevent editing while keeping the expression visible. @default false */
	readOnly?: boolean;
	/** `name`/`id` applied to the inner input. */
	name?: string;
	id?: string;
	placeholder?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const ctrl = { sm: "h-7 text-2xs", md: "h-8 text-xs", lg: "h-9 text-sm" } as const;

const ALLOWED = /^[\w\s+\-*/%().^]+$/;

/** Safe-ish evaluator: only arithmetic over declared variables. */
export function evaluateFormula(expr: string, vars: Record<string, number>): number | null {
	if (!expr.trim() || !ALLOWED.test(expr)) return null;
	const names = Object.keys(vars);
	try {
		const fn = new Function(...names, `"use strict"; return (${expr.replace(/\^/g, "**")});`);
		const out = fn(...names.map((n) => vars[n]));
		return typeof out === "number" && Number.isFinite(out) ? out : null;
	} catch {
		return null;
	}
}

export function FormulaInput(props: FormulaInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"variables",
		"suggestions",
		"showVariables",
		"showSuggestions",
		"showResult",
		"error",
		"readOnly",
		"name",
		"id",
		"placeholder",
		"variant",
		"size",
		"radius",
		"disabled",
	]);

	const names = () =>
		new Set([
			...(local.variables ?? []).map((v) => v.name),
			// suggestion tokens like `sqrt(` count as known identifiers
			...(local.suggestions ?? []).map((s) => s.token.replace(/\W[\s\S]*$/, "")),
		]);
	const unknowns = () =>
		[...(local.value ?? "").matchAll(/[A-Za-z_]\w*/g)]
			.map((m) => m[0])
			.filter((w) => !names().has(w) && !["e", "pi"].includes(w.toLowerCase()));
	const valid = () => Boolean(local.value?.trim()) && unknowns().length === 0 && ALLOWED.test(local.value ?? "");
	const invalid = () => Boolean(local.error) || (Boolean(local.value) && !valid());
	const errorMsg = () => (typeof local.error === "string" ? local.error : undefined);
	const result = () =>
		evaluateFormula(local.value ?? "", Object.fromEntries((local.variables ?? []).map((v) => [v.name, v.value ?? 0])));

	const chipCls =
		"rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

	return (
		<div class={`solidui-formula-input ${local.class ?? ""}`.trim()} {...rest}>
			<div
				class={`flex items-center overflow-hidden border focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${invalid() ? "border-destructive" : ""}`}
			>
				<span class="pl-2 font-mono text-muted-foreground">ƒx</span>
				<input
					type="text"
					value={local.value ?? ""}
					disabled={local.disabled}
					readOnly={local.readOnly}
					name={local.name}
					id={local.id}
					placeholder={local.placeholder ?? "e.g. price * qty * (1 - discount)"}
					aria-invalid={invalid() || undefined}
					class={`min-w-0 flex-1 border-0 bg-transparent px-2 font-mono text-foreground focus-visible:outline-none disabled:opacity-50 ${ctrl[local.size ?? "md"]}`}
					onInput={(e) => local.onChange?.(e.currentTarget.value)}
				/>
				<Show when={(local.showResult ?? true) && valid() && result() !== null}>
					<span class="pr-2 font-mono text-xs tabular-nums text-success">= {result()}</span>
				</Show>
			</div>
			<Show when={errorMsg()}>
				<div class="mt-1 text-2xs text-destructive" role="alert">
					{errorMsg()}
				</div>
			</Show>
			<Show when={!errorMsg() && unknowns().length}>
				<div class="mt-1 text-2xs text-destructive">Unknown: {[...new Set(unknowns())].join(", ")}</div>
			</Show>
			<Show when={(local.showVariables ?? true) && (local.variables ?? []).length}>
				<div class="mt-1.5 flex flex-wrap gap-1">
					<For each={local.variables}>
						{(v) => (
							<button
								type="button"
								disabled={local.disabled || local.readOnly}
								title={v.description}
								class={chipCls}
								onClick={() => local.onChange?.(`${local.value ?? ""}${v.name}`)}
							>
								{v.name}
								<Show when={v.value !== undefined}>
									<span class="text-muted-foreground/60">={v.value}</span>
								</Show>
							</button>
						)}
					</For>
				</div>
			</Show>
			<Show when={(local.showSuggestions ?? true) && (local.suggestions ?? []).length}>
				<div class="mt-1.5 flex flex-wrap gap-1">
					<For each={local.suggestions}>
						{(s) => (
							<button
								type="button"
								disabled={local.disabled || local.readOnly}
								title={s.description}
								class={chipCls}
								onClick={() => local.onChange?.(`${local.value ?? ""}${s.token}`)}
							>
								{s.label ?? s.token}
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
