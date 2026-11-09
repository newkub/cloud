import { createQuery } from "@tanstack/solid-query";
import { Badge, Button, Input } from "@wrikka/solid-ui";
import { createSignal, Show } from "solid-js";
import { CI_API_KEY, ciApiBase, orpc, queryClient } from "./api";
import { fmtTime } from "./format";
import { Card, MetaRow } from "./ui";

export function ConnectionCard(props: { description?: string }) {
	const [endpoint, setEndpoint] = createSignal(
		localStorage.getItem(CI_API_KEY) ?? "",
	);
	const [saved, setSaved] = createSignal(false);
	const [hasStored, setHasStored] = createSignal(
		Boolean(localStorage.getItem(CI_API_KEY)),
	);
	const [apiVersion, setApiVersion] = createSignal(0);

	const health = createQuery(() => ({
		queryKey: ["health", apiVersion()],
		queryFn: () => orpc.health(),
		retry: 0,
	}));

	function refresh() {
		setApiVersion((v) => v + 1);
		void queryClient.invalidateQueries();
	}

	function saveEndpoint() {
		const value = endpoint().trim().replace(/\/+$/, "");
		if (value) {
			localStorage.setItem(CI_API_KEY, value);
		} else {
			localStorage.removeItem(CI_API_KEY);
		}
		setEndpoint(value);
		setHasStored(Boolean(value));
		setSaved(true);
		refresh();
		window.setTimeout(() => setSaved(false), 2000);
	}

	function resetEndpoint() {
		localStorage.removeItem(CI_API_KEY);
		setEndpoint("");
		setHasStored(false);
		refresh();
	}

	return (
		<Card>
			<div class="mb-4 flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span class="i-mdi:pipe text-lg text-acc" />
					<h2 class="text-sm font-medium text-fg">CI connection</h2>
				</div>
				<Show
					when={health.data}
					fallback={
						<Badge
							variant={health.isError ? "destructive" : "default"}
							class="gap-1.5"
						>
							<span
								class={`i-mdi:circle text-[8px] ${
									health.isError ? "text-err" : "text-faint"
								}`}
							/>
							{health.isError ? "offline" : "checking…"}
						</Badge>
					}
				>
					{(h) => (
						<Badge variant={h().ok ? "success" : "warning"} class="gap-1.5">
							<span class="i-mdi:circle text-[8px]" />
							{h().ok ? "healthy" : "degraded"}
						</Badge>
					)}
				</Show>
			</div>

			<Show when={props.description}>
				<p class="mb-3 text-xs leading-relaxed text-faint">
					{props.description}
				</p>
			</Show>

			<label for="ci-endpoint" class="mb-1.5 block text-sm text-fg">
				API endpoint
			</label>
			<Input
				id="ci-endpoint"
				value={endpoint()}
				onChange={setEndpoint}
				placeholder="Leave empty to use /rpc (dev proxy)"
				leftIcon={<span class="i-mdi:api" />}
			/>
			<span class="mt-1.5 block text-xs text-faint">
				Base URL of the CI worker. The console appends{" "}
				<span class="font-mono">/rpc</span>. Current base:{" "}
				<span class="font-mono text-dim">{ciApiBase() || "same origin"}</span>
			</span>

			<div class="mt-4 flex flex-wrap items-center gap-2">
				<Button variant="primary" size="sm" onClick={saveEndpoint}>
					Save endpoint
				</Button>
				<Show when={hasStored()}>
					<Button variant="ghost" size="sm" onClick={resetEndpoint}>
						Reset to default
					</Button>
				</Show>
				<Show when={saved()}>
					<span class="inline-flex items-center gap-1 text-xs text-ok">
						<span class="i-mdi:check" /> Saved
					</span>
				</Show>
			</div>

			<div class="mt-4 border-t border-edge pt-2">
				<Show
					when={health.data}
					fallback={
						<p class="py-3 text-sm text-dim">
							{health.isError
								? "The CI worker did not respond. Start it with the mock server or point the console at a deployed worker."
								: "Checking worker health…"}
						</p>
					}
				>
					{(h) => (
						<>
							<MetaRow label="Worker">{h().name}</MetaRow>
							<MetaRow label="Bindings">
								<span class="break-all font-mono text-xs">{h().bindings}</span>
							</MetaRow>
							<MetaRow label="Checked">{fmtTime(h().time)}</MetaRow>
						</>
					)}
				</Show>
			</div>
		</Card>
	);
}
