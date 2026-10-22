import { For, Show } from "solid-js";
import type { ApiSpec } from "../../lib/api-spec";
import { CopyButton } from "./CopyButton";
import { SectionCard } from "./SectionCard";

export function cliUsage(ep: ApiSpec): string {
	const cli = ep.cli;
	if (!cli) return `${ep.method} ${ep.path}`;
	return [
		cli.command,
		cli.subcommand,
		...(cli.args?.map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`)) ?? []),
	].join(" ");
}

/** "Usage" section card shown for the cli variant of ApiReference. */
export function CliUsageSection(props: { spec: ApiSpec }) {
	const usage = () => cliUsage(props.spec);
	return (
		<SectionCard title="Usage" actions={<CopyButton text={usage} />}>
			<pre class="text-sm font-mono text-foreground bg-background border border-border rounded-lg p-3 m-0 overflow-x-auto">
				{usage()}
			</pre>
			<Show when={props.spec.cli?.args?.length}>
				<div class="mt-4">
					<For each={props.spec.cli?.args ?? []}>
						{(a) => (
							<div class="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
								<code class="text-sm font-mono font-semibold text-foreground">{a.name}</code>
								<Show when={a.required}>
									<span class="text-2xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
										required
									</span>
								</Show>
								<span class="text-xs text-muted-foreground flex-1">{a.description}</span>
							</div>
						)}
					</For>
				</div>
			</Show>
		</SectionCard>
	);
}
