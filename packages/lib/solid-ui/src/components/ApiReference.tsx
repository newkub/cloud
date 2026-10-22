/**
 * ApiReference - structured endpoint documentation: parameters, request body,
 * cURL snippet and collapsible response codes. Ported from create-docs runtime;
 * prop-driven, no framework context.
 */

import { For, type JSX, Show, splitProps } from "solid-js";
import type { ApiSpec } from "../lib/api-spec";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CliUsageSection } from "./api-reference/CliUsageSection";
import { CopyButton } from "./api-reference/CopyButton";
import { JsonBlock } from "./api-reference/JsonBlock";
import { ParamRow } from "./api-reference/ParamRow";
import { ResponseRow } from "./api-reference/ResponseRow";
import { SectionCard } from "./api-reference/SectionCard";
import { curlCommand } from "./api-reference/utils";

export interface ApiReferenceProps extends JSX.HTMLAttributes<HTMLDivElement> {
	endpoint?: ApiSpec;
	/** Doc style — rest/rpc show parameters+cURL, graphql shows query, cli shows usage. */
	variant?: "rest" | "graphql" | "cli" | "rpc";
	/** Optional rendered description (e.g. markdown output) shown above the sections. */
	description?: JSX.Element;
	/** Corner radius applied to section cards. */
	radius?: Radius;
	/** Shadow elevation applied to section cards. */
	elevation?: Elevation;
}

export function ApiReference(props: ApiReferenceProps) {
	const [local, rest] = splitProps(props, ["class", "endpoint", "variant", "description", "radius", "elevation"]);
	const ep = () => local.endpoint ?? ({} as ApiSpec);
	const variant = () => local.variant ?? "rest";
	const codes = () => Object.keys(ep().responses ?? {});
	const cardCls = `${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""}`;

	return (
		<div class={`solidui-api-reference ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.description}>
				<div class="mb-6">{local.description}</div>
			</Show>

			<Show when={variant() === "cli"}>
				<div class={cardCls}>
					<CliUsageSection spec={ep()} />
				</div>
			</Show>

			<Show when={variant() === "graphql"}>
				<Show when={ep().graphql?.query}>
					<div class={cardCls}>
						<SectionCard title="Query" actions={<CopyButton text={() => ep().graphql?.query ?? ""} />}>
							<pre class="text-xs font-mono text-foreground bg-background border border-border rounded-lg p-3 m-0 overflow-x-auto whitespace-pre-wrap">
								{ep().graphql?.query}
							</pre>
						</SectionCard>
					</div>
				</Show>
				<Show when={ep().graphql?.variables != null}>
					<div class={cardCls}>
						<SectionCard title="Variables">
							<JsonBlock value={ep().graphql?.variables} />
						</SectionCard>
					</div>
				</Show>
			</Show>

			<Show when={variant() === "rest" || variant() === "rpc"}>
				<Show when={(ep().parameters ?? []).length > 0}>
					<div class={cardCls}>
						<SectionCard
							title="Parameters"
							actions={
								<span class="text-2xs text-muted-foreground">
									{(ep().parameters ?? []).length} field{(ep().parameters ?? []).length === 1 ? "" : "s"}
								</span>
							}
						>
							<For each={ep().parameters ?? []}>{(p) => <ParamRow p={p} />}</For>
						</SectionCard>
					</div>
				</Show>

				<Show when={ep().requestBody}>
					<div class={cardCls}>
						<SectionCard
							title="Request Body"
							actions={
								<Show when={ep().requestBody?.required}>
									<span class="text-2xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
										required
									</span>
								</Show>
							}
						>
							<Show when={ep().requestBody?.description}>
								<p class="text-sm text-muted-foreground m-0 mb-3 leading-relaxed">{ep().requestBody?.description}</p>
							</Show>
							<Show when={ep().requestBody?.example != null}>
								<JsonBlock value={ep().requestBody?.example} />
							</Show>
						</SectionCard>
					</div>
				</Show>

				<div class={cardCls}>
					<SectionCard title="cURL" actions={<CopyButton text={() => curlCommand(ep())} />}>
						<pre class="text-xs font-mono text-foreground bg-background border border-border rounded-lg p-3 m-0 overflow-x-auto whitespace-pre-wrap">
							{curlCommand(ep())}
						</pre>
					</SectionCard>
				</div>
			</Show>

			<Show when={ep().requestBody?.example != null && variant() === "cli"}>
				<div class={cardCls}>
					<SectionCard title="Options">
						<JsonBlock value={ep().requestBody?.example} />
					</SectionCard>
				</div>
			</Show>

			<Show when={codes().length > 0}>
				<div class={cardCls}>
					<SectionCard
						title={variant() === "cli" ? "Exit codes" : "Responses"}
						actions={
							<span class="text-2xs text-muted-foreground">
								{codes().length} code{codes().length === 1 ? "" : "s"}
							</span>
						}
					>
						<For each={codes()}>
							{(code) => (
								<ResponseRow
									code={code}
									description={ep().responses?.[code]?.description ?? ""}
									example={ep().responses?.[code]?.example}
								/>
							)}
						</For>
					</SectionCard>
				</div>
			</Show>
		</div>
	);
}
