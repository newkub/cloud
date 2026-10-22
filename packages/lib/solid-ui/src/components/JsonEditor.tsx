/**
 * JsonEditor — JSON textarea with live validation, pretty-print and minify.
 */
import { createEffect, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface JsonEditorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput"> {
	value?: string;
	/** Called with the raw text; `parsed` is null when invalid. */
	onChange?: (text: string, parsed: unknown | null) => void;
	/** Called whenever validity changes — `null` when the JSON parses, else the error message. */
	onValidate?: (error: string | null) => void;
	rows?: number;
	/** Show the pretty/minify toolbar. @default true */
	toolbar?: boolean;
	/** Show the parser error message under the editor. @default true */
	showError?: boolean;
	/** External error — boolean styles the editor, a string overrides the parser message. */
	error?: boolean | string;
	/** Allow editing — false renders read-only. */
	readOnly?: boolean;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
	/** `name`/`id`/`placeholder`/`aria-label` applied to the textarea. */
	name?: string;
	id?: string;
	placeholder?: string;
	"aria-label"?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function JsonEditor(props: JsonEditorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"onValidate",
		"rows",
		"toolbar",
		"showError",
		"error",
		"readOnly",
		"fullWidth",
		"name",
		"id",
		"placeholder",
		"aria-label",
		"variant",
		"size",
		"radius",
		"disabled",
	]);

	const parse = (text: string) => {
		try {
			return { ok: true as const, value: JSON.parse(text) };
		} catch (e) {
			return { ok: false as const, error: e instanceof Error ? e.message : "Invalid JSON" };
		}
	};
	const result = () => parse(local.value ?? "");
	const invalid = () => !result().ok || Boolean(local.error);
	const errorText = () => (typeof local.error === "string" ? local.error : !result().ok ? result().error : undefined);
	const emit = (text: string) => local.onChange?.(text, parse(text).ok ? parse(text).value : null);
	const pretty = () => {
		const r = result();
		if (r.ok) emit(JSON.stringify(r.value, null, 2));
	};
	const minify = () => {
		const r = result();
		if (r.ok) emit(JSON.stringify(r.value));
	};

	// Report parser validity to consumers.
	createEffect(() => {
		local.onValidate?.(
			local.value === undefined || local.value === "" ? null : result().ok ? null : (errorText() ?? "Invalid JSON"),
		);
	});

	const toolBtn = (label: string, fn: () => void) => (
		<button
			type="button"
			disabled={local.disabled || !result().ok}
			class="h-6 rounded px-2 text-2xs font-medium text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40"
			onClick={fn}
		>
			{label}
		</button>
	);

	return (
		<div class={`solidui-json-editor ${(local.fullWidth ?? true) ? "w-full" : "inline-block"}`.trim()}>
			<div
				class={`overflow-hidden border focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${
					invalid() ? "border-destructive" : ""
				} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<Show when={local.toolbar ?? true}>
					<div class="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1">
						{toolBtn("Pretty", pretty)}
						{toolBtn("Minify", minify)}
						<span
							class={`ml-auto text-2xs ${invalid() ? "text-destructive" : "text-success"}`}
							title={errorText()}
							role="status"
						>
							{invalid() ? "Invalid JSON" : "Valid JSON"}
						</span>
					</div>
				</Show>
				<textarea
					rows={local.rows ?? 8}
					value={local.value ?? ""}
					disabled={local.disabled}
					readOnly={local.readOnly}
					name={local.name}
					id={local.id}
					placeholder={local.placeholder}
					aria-label={local["aria-label"]}
					spellcheck={false}
					aria-invalid={invalid() || undefined}
					class={`w-full resize-y border-0 bg-transparent p-3 font-mono text-foreground focus-visible:outline-none disabled:opacity-50 ${textSize[local.size ?? "md"]}`}
					onInput={(e) => emit(e.currentTarget.value)}
				/>
			</div>
			<Show when={(local.showError ?? true) && errorText()}>
				<span class="mt-1 block text-xs text-destructive" role="alert">
					{errorText()}
				</span>
			</Show>
		</div>
	);
}
