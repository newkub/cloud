/**
 * ApiEndpoint — HTTP method chip + path + description, with optional copy button.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

const methodClass: Record<HttpMethod, string> = {
	GET: "bg-success/15 text-success",
	POST: "bg-info/15 text-info",
	PUT: "bg-warning/15 text-warning",
	PATCH: "bg-warning/15 text-warning",
	DELETE: "bg-destructive/15 text-destructive",
	HEAD: "bg-muted text-muted-foreground",
	OPTIONS: "bg-muted text-muted-foreground",
};

export interface ApiEndpointProps extends JSX.HTMLAttributes<HTMLDivElement> {
	method: HttpMethod;
	path: string;
	description?: string;
	/** Base URL shown dimmed before the path. */
	baseUrl?: string;
	/** Copy button copies `baseUrl + path`. */
	copyable?: boolean;
	/** Mark deprecated endpoints — dims and strikes the path. */
	deprecated?: boolean;
	/** Badge text next to the description (e.g. "beta", "v2"). */
	badge?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const pad = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-4 py-3" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function ApiEndpoint(props: ApiEndpointProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"method",
		"path",
		"description",
		"baseUrl",
		"copyable",
		"deprecated",
		"badge",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const copy = (e: MouseEvent) => {
		e.stopPropagation();
		void copyText(`${local.baseUrl ?? ""}${local.path}`);
	};
	return (
		<div
			class={`solidui-api-endpoint inline-flex items-center gap-3 border border-border bg-surface font-mono ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${
				local.elevation ? elevationMap[local.elevation] : ""
			} ${local.deprecated ? "opacity-60" : ""} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span
				class={`shrink-0 rounded px-1.5 py-0.5 font-bold uppercase tracking-wide ${methodClass[local.method]} ${textSize[local.size ?? "md"]}`}
			>
				{local.method}
			</span>
			<span
				class={`min-w-0 truncate text-foreground ${textSize[local.size ?? "md"]} ${local.deprecated ? "line-through" : ""}`}
			>
				<Show when={local.baseUrl}>
					<span class="text-muted-foreground">{local.baseUrl}</span>
				</Show>
				{local.path}
			</span>
			<Show when={local.badge}>
				<span class="shrink-0 rounded bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground">{local.badge}</span>
			</Show>
			<Show when={local.description}>
				<span class="hidden shrink-0 font-sans text-xs text-muted-foreground md:inline">{local.description}</span>
			</Show>
			<Show when={local.copyable}>
				<button
					type="button"
					class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-label={copied() ? "Copied" : "Copy endpoint"}
					onClick={copy}
				>
					<Show
						when={copied()}
						fallback={
							<svg
								class="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<rect x="9" y="9" width="12" height="12" rx="2" />
								<path d="M5 15V5a2 2 0 0 1 2-2h10" />
							</svg>
						}
					>
						<svg
							class="h-3.5 w-3.5 text-success"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</Show>
				</button>
			</Show>
		</div>
	);
}
