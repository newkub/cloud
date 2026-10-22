/**
 * EnvEditor — KEY=VALUE row editor for environment variables.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface EnvEntry {
	key: string;
	value: string;
}

export interface EnvEditorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	entries: EnvEntry[];
	onChange?: (entries: EnvEntry[]) => void;
	/** Allow adding new rows. @default true */
	allowAdd?: boolean;
	/** Allow removing rows. @default true */
	allowRemove?: boolean;
	/** Mask values as passwords. */
	masked?: boolean;
	disabled?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
}

const rowText = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function EnvEditor(props: EnvEditorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"entries",
		"onChange",
		"allowAdd",
		"allowRemove",
		"masked",
		"disabled",
		"size",
		"radius",
		"fullWidth",
	]);
	const [revealed, setRevealed] = createSignal<Set<number>>(new Set());

	const update = (i: number, patch: Partial<EnvEntry>) => {
		local.onChange?.((local.entries ?? []).map((e, j) => (j === i ? { ...e, ...patch } : e)));
	};
	const remove = (i: number) => local.onChange?.((local.entries ?? []).filter((_, j) => j !== i));
	const add = () => local.onChange?.([...(local.entries ?? []), { key: "", value: "" }]);
	const inputCls = `w-full min-w-0 border-0 bg-transparent font-mono text-foreground focus-visible:outline-none disabled:opacity-50 ${rowText[local.size ?? "md"]}`;

	return (
		<div
			class={`solidui-env-editor divide-y divide-border border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${
				(local.fullWidth ?? true) ? "w-full" : "inline-block min-w-72"
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.entries ?? []}>
				{(entry, i) => (
					<div class="flex items-center gap-2 px-3 py-1.5">
						<input
							class={`${inputCls} w-2/5 font-semibold`}
							placeholder="KEY"
							aria-label="Variable name"
							value={entry.key}
							disabled={local.disabled}
							onInput={(e) => update(i(), { key: e.currentTarget.value })}
						/>
						<span class="text-muted-foreground" aria-hidden="true">
							=
						</span>
						<input
							type={local.masked && !revealed().has(i()) ? "password" : "text"}
							class={inputCls}
							placeholder="value"
							aria-label="Variable value"
							value={entry.value}
							disabled={local.disabled}
							onInput={(e) => update(i(), { value: e.currentTarget.value })}
						/>
						<Show when={local.masked}>
							<button
								type="button"
								class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								aria-label={revealed().has(i()) ? "Hide value" : "Reveal value"}
								onClick={() =>
									setRevealed((s) => {
										const next = new Set(s);
										if (next.has(i())) next.delete(i());
										else next.add(i());
										return next;
									})
								}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									{revealed().has(i()) ? (
										<path
											d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									) : (
										<path
											d="m3 3 18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A16.6 16.6 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.4-1"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									)}
								</svg>
							</button>
						</Show>
						<Show when={local.allowRemove ?? true}>
							<button
								type="button"
								class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
								aria-label="Remove entry"
								disabled={local.disabled}
								onClick={() => remove(i())}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
								</svg>
							</button>
						</Show>
					</div>
				)}
			</For>
			<Show when={local.allowAdd ?? true}>
				<button
					type="button"
					class={`w-full px-3 py-2 text-left font-mono text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none disabled:opacity-50 ${rowText[local.size ?? "md"]}`}
					disabled={local.disabled}
					onClick={add}
				>
					+ Add variable
				</button>
			</Show>
		</div>
	);
}
