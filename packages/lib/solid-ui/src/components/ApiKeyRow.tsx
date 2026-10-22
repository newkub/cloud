/**
 * ApiKeyRow — API key row: name, masked key with reveal/copy, created/last-used meta and revoke.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius } from "../lib/variants";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";

export interface ApiKeyRowKey {
	/** Human label, e.g. "Production deploys". */
	name: string;
	/** Key prefix shown when masked, e.g. "sk_live". */
	prefix: string;
	/** Full secret — enables the reveal toggle and full copy value. */
	key?: string;
	/** Created date text. */
	createdAt?: string;
	/** Last-used text, e.g. "2h ago". */
	lastUsedAt?: string;
}

export interface ApiKeyRowProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onCopy"> {
	/** Key to render. */
	apiKey?: ApiKeyRowKey;
	/** Called after the inline confirm step approves a revoke. */
	onRevoke?: (apiKey: ApiKeyRowKey) => void;
	/** Called when the copy button is clicked. */
	onCopy?: (apiKey: ApiKeyRowKey) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ApiKeyRow(props: ApiKeyRowProps) {
	const [local, rest] = splitProps(props, ["class", "apiKey", "onRevoke", "onCopy", "radius", "elevation"]);
	const [revealed, setRevealed] = createSignal(false);
	const [confirming, setConfirming] = createSignal(false);
	const masked = () => `${local.apiKey?.prefix}_••••••••••••••••`;
	const display = () => (revealed() && local.apiKey?.key ? local.apiKey?.key : masked());
	return (
		<div
			class={`solidui-api-key-row flex items-center gap-3 border-b border-border/50 py-3 last:border-0 ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="min-w-0 flex-1">
				<span class="block truncate text-sm font-medium text-foreground">{local.apiKey?.name}</span>
				<div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-2xs text-muted-foreground">
					<Show when={local.apiKey?.createdAt}>
						<span>Created {local.apiKey?.createdAt}</span>
					</Show>
					<Show when={local.apiKey?.lastUsedAt}>
						<span>Last used {local.apiKey?.lastUsedAt}</span>
					</Show>
					<Show when={!local.apiKey?.lastUsedAt}>
						<span>Never used</span>
					</Show>
				</div>
			</div>
			<code class="shrink-0 rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground">
				{display()}
			</code>
			<Show when={local.apiKey?.key}>
				<button
					type="button"
					class="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={revealed() ? "Hide API key" : "Reveal API key"}
					aria-pressed={revealed()}
					onClick={() => setRevealed((v) => !v)}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<Show
							when={revealed()}
							fallback={
								<>
									<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</>
							}
						>
							<path d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 2.9M6.6 6.6A16.6 16.6 0 0 0 2 12s3.5 7 10 7a9.9 9.9 0 0 0 4.4-1" />
						</Show>
					</svg>
				</button>
			</Show>
			<CopyButton
				iconOnly
				value={local.apiKey?.key ?? local.apiKey?.prefix ?? ""}
				label="Copy API key"
				copiedLabel="Copied"
				class="shrink-0"
				radius={local.radius}
				onClick={() => local.apiKey && local.onCopy?.(local.apiKey)}
			/>
			<Show when={local.onRevoke}>
				<Show
					when={!confirming()}
					fallback={
						<span class="flex shrink-0 items-center gap-1">
							<Button
								variant="destructive"
								size="sm"
								onClick={() => {
									local.apiKey && local.onRevoke?.(local.apiKey);
									setConfirming(false);
								}}
							>
								Confirm
							</Button>
							<Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
								Cancel
							</Button>
						</span>
					}
				>
					<Button
						variant="ghost"
						size="sm"
						class="shrink-0 text-destructive hover:text-destructive"
						onClick={() => setConfirming(true)}
					>
						Revoke
					</Button>
				</Show>
			</Show>
		</div>
	);
}
