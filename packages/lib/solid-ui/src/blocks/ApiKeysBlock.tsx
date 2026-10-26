import { createSignal, For, Show, type JSX } from "solid-js";
import { ApiKeyRow, type ApiKeyRowKey } from "../components/ApiKeyRow";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { Label } from "../components/Label";

export interface ApiKeysBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	keys?: ApiKeyRowKey[];
	/** Shown once after creation — never persisted in the list. */
	onCreate?: (name: string) => Promise<string | void> | string | void;
	onRevoke?: (key: ApiKeyRowKey) => void;
}

/** API key management: create, reveal once, copy and revoke with confirmation. */
export function ApiKeysBlock(props: ApiKeysBlockProps) {
	const [name, setName] = createSignal("");
	const [creating, setCreating] = createSignal(false);
	const [revealed, setRevealed] = createSignal<string>("");

	async function create() {
		if (!name().trim() || creating()) return;
		setCreating(true);
		try {
			const secret = await props.onCreate?.(name().trim());
			if (typeof secret === "string") setRevealed(secret);
			setName("");
		} finally {
			setCreating(false);
		}
	}

	return (
		<div class={`flex flex-col gap-4 ${props.class ?? ""}`}>
			<Card>
				<CardHeader>
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h2 class="text-base font-semibold">{props.title ?? "API keys"}</h2>
							<p class="text-sm text-muted-foreground">
								{props.description ?? "Keys authenticate requests from your own services."}
							</p>
						</div>
						<Badge variant="outline">{props.keys?.length ?? 0} active</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<div class="flex flex-col gap-1.5 sm:flex-row sm:items-end">
						<div class="flex flex-1 flex-col gap-1.5">
							<Label htmlFor="api-key-name">Key name</Label>
							<Input
								id="api-key-name"
								placeholder="Production deploys"
								value={name()}
								onChange={setName}
							/>
						</div>
						<Button variant="primary" disabled={!name().trim() || creating()} onClick={create}>
							{creating() ? "Creating…" : "Create key"}
						</Button>
					</div>

					<Show when={revealed()}>
						<div class="flex flex-col gap-1 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
							<p class="text-xs font-medium text-warning">Copy this key now — it will not be shown again.</p>
							<code class="break-all text-xs">{revealed()}</code>
						</div>
					</Show>

					<Divider />

					<Show
						when={props.keys?.length}
						fallback={<EmptyState title="No keys yet" description="Create your first key to call the API." size="sm" />}
					>
						<div class="flex flex-col gap-2">
							<For each={props.keys}>
								{(key) => <ApiKeyRow apiKey={key} onRevoke={props.onRevoke} />}
							</For>
						</div>
					</Show>
				</CardContent>
			</Card>
		</div>
	);
}
