/**
 * EnvTable — KEY=VALUE table for environment variables with masked secrets,
 * per-row reveal/copy/delete actions and an add-row footer. Read-oriented
 * companion to EnvEditor (which is an input grid).
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface EnvVar {
	key: string;
	value: string;
	/** Mask the value until explicitly revealed. */
	secret?: boolean;
}

export interface EnvTableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	vars: EnvVar[];
	onChange?: (vars: EnvVar[]) => void;
	/** Show the add-row footer. @default true */
	allowAdd?: boolean;
	/** Show the per-row delete action. @default true */
	allowRemove?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const iconBtn =
	"inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const eyeOpen = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
		<path
			d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
);
const eyeClosed = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
		<path
			d="m3 3 18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A16.6 16.6 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.4-1"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
);
const copyIcon = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
		<rect x="9" y="9" width="12" height="12" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);
const checkIcon = (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		class="h-3.5 w-3.5 text-success"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
	</svg>
);
const trashIcon = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
		<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
	</svg>
);

export function EnvTable(props: EnvTableProps) {
	const [local, rest] = splitProps(props, ["class", "vars", "onChange", "allowAdd", "allowRemove", "radius"]);
	const [revealed, setRevealed] = createSignal<Set<number>>(new Set());
	const [copiedIndex, setCopiedIndex] = createSignal(-1);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const [newKey, setNewKey] = createSignal("");
	const [newValue, setNewValue] = createSignal("");

	const toggleReveal = (i: number) =>
		setRevealed((s) => {
			const next = new Set(s);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});

	const copy = async (i: number, v: EnvVar) => {
		setCopiedIndex(i);
		await copyText(`${v.key}=${v.value}`);
	};

	const remove = (i: number) => local.onChange?.((local.vars ?? []).filter((_, j) => j !== i));
	const add = () => {
		if (!newKey().trim()) return;
		local.onChange?.([...(local.vars ?? []), { key: newKey().trim(), value: newValue() }]);
		setNewKey("");
		setNewValue("");
	};

	return (
		<div
			class={`solidui-env-table divide-y divide-border border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.vars ?? []}>
				{(v, i) => (
					<div class="flex items-center gap-2 px-3 py-1.5">
						<span class="w-2/5 min-w-0 truncate font-mono text-xs font-semibold text-foreground">{v.key}</span>
						<span class="hidden select-none text-muted-foreground sm:inline" aria-hidden="true">
							=
						</span>
						<span
							class="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground"
							title={v.secret && !revealed().has(i()) ? "Hidden" : v.value}
						>
							{v.secret && !revealed().has(i()) ? "••••••••" : v.value}
						</span>
						<Show when={v.secret}>
							<button
								type="button"
								class={iconBtn}
								aria-label={revealed().has(i()) ? `Hide ${v.key}` : `Reveal ${v.key}`}
								aria-pressed={revealed().has(i())}
								onClick={() => toggleReveal(i())}
							>
								{revealed().has(i()) ? eyeOpen : eyeClosed}
							</button>
						</Show>
						<button type="button" class={iconBtn} aria-label={`Copy ${v.key}`} onClick={() => copy(i(), v)}>
							{copied() && copiedIndex() === i() ? checkIcon : copyIcon}
						</button>
						<Show when={local.allowRemove ?? true}>
							<button
								type="button"
								class={`${iconBtn} hover:text-destructive`}
								aria-label={`Delete ${v.key}`}
								onClick={() => remove(i())}
							>
								{trashIcon}
							</button>
						</Show>
					</div>
				)}
			</For>
			<Show when={(local.vars ?? []).length === 0}>
				<p class="m-0 px-3 py-2 font-mono text-xs text-muted-foreground">No variables defined.</p>
			</Show>
			<Show when={local.allowAdd ?? true}>
				<div class="flex items-center gap-2 px-3 py-1.5">
					<input
						class="w-2/5 min-w-0 border-0 bg-transparent font-mono text-xs font-semibold text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none"
						placeholder="KEY"
						aria-label="New variable name"
						value={newKey()}
						onInput={(e) => setNewKey(e.currentTarget.value)}
					/>
					<span class="select-none text-muted-foreground" aria-hidden="true">
						=
					</span>
					<input
						class="min-w-0 flex-1 border-0 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none"
						placeholder="value"
						aria-label="New variable value"
						value={newValue()}
						onInput={(e) => setNewValue(e.currentTarget.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") add();
						}}
					/>
					<button
						type="button"
						class="inline-flex h-7 shrink-0 items-center rounded border border-border bg-muted px-2 font-mono text-2xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
						disabled={!newKey().trim()}
						onClick={add}
					>
						+ Add
					</button>
				</div>
			</Show>
		</div>
	);
}
