/**
 * RegexBuilder - compose a regex from segment chips with live pattern preview and test-string highlighting.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { compilePattern, matchStatus, splitMatches } from "./regex-builder/matching";
import {
	KINDS,
	type RegexSegment,
	type RegexSegmentKind,
	segmentFragment,
	segmentLabel,
} from "./regex-builder/segments";

export type { RegexSegment, RegexSegmentKind } from "./regex-builder/segments";

export interface RegexBuilderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled pattern — overrides the internally joined pattern when set. */
	value?: string;
	/** Initial segment chips. */
	defaultSegments?: RegexSegment[];
	/** Called with the joined pattern and the segment list on every change. */
	onChange?: (pattern: string, segments: RegexSegment[]) => void;
	/** Regex flags for the preview and matcher. @default "g" */
	flags?: string;
	/** Initial test string. */
	test?: string;
	/** Called when the test string changes. */
	onTestChange?: (test: string) => void;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function RegexBuilder(props: RegexBuilderProps) {
	const { className, rest: restProps } = useComponentClasses(props, {
		base: "solidui-regex-builder space-y-3",
		unstyled: props.unstyled,
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});
	const [, rest] = splitProps(restProps, [
		"value",
		"defaultSegments",
		"onChange",
		"flags",
		"test",
		"onTestChange",
		"disabled",
	]);
	const testId = `regex-builder-test-${createUniqueId()}`;
	const literalId = `regex-builder-literal-${createUniqueId()}`;
	const [segments, setSegments] = createSignal<RegexSegment[]>(props.defaultSegments ?? []);
	const [inner, setInner] = createSignal((props.defaultSegments ?? []).map(segmentFragment).join(""));
	const [literal, setLiteral] = createSignal("");
	const [testText, setTestText] = createSignal(props.test ?? "");
	const flags = () => props.flags ?? "g";
	const pattern = () => props.value ?? inner();

	const emit = (next: RegexSegment[]) => {
		setSegments(next);
		const p = next.map(segmentFragment).join("");
		setInner(p);
		props.onChange?.(p, next);
	};
	const add = (kind: RegexSegmentKind) => {
		if (kind === "literal") {
			const v = literal();
			if (!v) return;
			emit([...segments(), { kind, value: v }]);
			setLiteral("");
			return;
		}
		emit([...segments(), { kind }]);
	};
	const remove = (index: number) => emit(segments().filter((_, i) => i !== index));

	const result = () => compilePattern(pattern(), flags());
	const matches = () => splitMatches(result(), testText());
	const status = () => matchStatus(result(), testText(), matches().count);

	return (
		<div class={className()} {...rest}>
			<div class="flex flex-wrap items-center gap-1.5">
				<For each={KINDS}>
					{(k) => (
						<button
							type="button"
							disabled={props.disabled}
							class="h-7 rounded-md border border-border bg-transparent px-2 text-2xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
							onClick={() => add(k.kind)}
						>
							{`+ ${k.label}`}
						</button>
					)}
				</For>
				<span class="flex items-center gap-1">
					<label for={literalId} class="sr-only">
						Literal text
					</label>
					<input
						id={literalId}
						class="h-7 w-28 rounded-md border border-input bg-background px-2 text-2xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
						placeholder="literal"
						value={literal()}
						disabled={props.disabled}
						onInput={(e) => setLiteral(e.currentTarget.value)}
					/>
					<button
						type="button"
						disabled={props.disabled}
						class="h-7 rounded-md border border-border bg-transparent px-2 text-2xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
						onClick={() => add("literal")}
					>
						+ Literal
					</button>
				</span>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: list semantics need a div for flex layout */}
			<div class="flex flex-wrap items-center gap-1.5" role="list" aria-label="Pattern segments">
				<Show when={segments().length === 0}>
					<span class="text-2xs text-muted-foreground">No segments yet</span>
				</Show>
				<For each={segments()}>
					{(s, i) => (
						// biome-ignore lint/a11y/useSemanticElements: listitem role inside role=list container
						<span
							role="listitem"
							class="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-2xs text-primary"
						>
							{segmentFragment(s)}
							<button
								type="button"
								disabled={props.disabled}
								aria-label={`Remove ${segmentLabel(s)}`}
								class="rounded-sm text-primary/70 transition-colors hover:text-primary disabled:opacity-50"
								onClick={() => remove(i())}
							>
								×
							</button>
						</span>
					)}
				</For>
			</div>
			<div>
				<p class="text-2xs font-medium text-muted-foreground">Pattern</p>
				<code
					data-testid="regex-pattern"
					class="mt-0.5 block rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
				>
					{`/${pattern()}/${flags()}`}
				</code>
				<Show when={result().state === "invalid"}>
					<p role="alert" class="mt-1 text-2xs text-destructive">
						Invalid pattern
					</p>
				</Show>
			</div>
			<div>
				<label for={testId} class="text-2xs font-medium text-muted-foreground">
					Test string
				</label>
				<input
					id={testId}
					class="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					placeholder="Type to test the pattern…"
					value={testText()}
					disabled={props.disabled}
					onInput={(e) => {
						setTestText(e.currentTarget.value);
						props.onTestChange?.(e.currentTarget.value);
					}}
				/>
				<div
					class="mt-1 min-h-7 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
					aria-live="polite"
				>
					<Show when={testText()} fallback={<span class="text-muted-foreground">—</span>}>
						<For each={matches().parts}>
							{(p) =>
								p.match ? (
									<mark class="rounded-sm bg-warning/40 px-0.5 text-foreground">{p.text}</mark>
								) : (
									<span>{p.text}</span>
								)
							}
						</For>
					</Show>
				</div>
				<p class="mt-1 text-2xs text-muted-foreground">{status()}</p>
			</div>
		</div>
	);
}
