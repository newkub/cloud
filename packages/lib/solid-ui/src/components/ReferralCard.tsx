/**
 * ReferralCard - referral link/code card with copy-to-clipboard button and optional stats.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ReferralStats {
	/** Number of completed referrals. */
	count: number;
	/** Stat caption, e.g. "friends joined". */
	label: string;
}

export interface ReferralCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onCopy"> {
	/** Card heading. @default "Refer a friend" */
	title?: string;
	/** Referral code — used as display text when no url is given. */
	code?: string;
	/** Full referral URL. */
	url?: string;
	/** Reward description, e.g. "You both get $10". */
	reward?: string;
	/** Referral counter. */
	stats?: ReferralStats;
	/** Called after the link is copied. */
	onCopy?: (text: string) => void;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

/** Copy text via the Clipboard API, falling back to a hidden textarea + execCommand. */
async function copyText(text: string): Promise<void> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return;
		}
		throw new Error("clipboard unavailable");
	} catch {
		const el = document.createElement("textarea");
		el.value = text;
		el.setAttribute("readonly", "");
		el.style.position = "absolute";
		el.style.left = "-9999px";
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	}
}

export function ReferralCard(props: ReferralCardProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-referral-card flex flex-col gap-3 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["title", "code", "url", "reward", "stats", "onCopy"]);

	const link = () => local.url ?? local.code ?? "";
	const [copied, setCopied] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const copy = async () => {
		if (!link()) return;
		await copyText(link());
		local.onCopy?.(link());
		setCopied(true);
		clearTimeout(timer);
		timer = setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div class={className()} {...rest}>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="font-semibold text-foreground">{local.title ?? "Refer a friend"}</div>
					<Show when={local.reward}>
						<div class="text-xs text-muted-foreground">{local.reward}</div>
					</Show>
				</div>
				<Show when={local.stats}>
					{/* biome-ignore lint/a11y/useSemanticElements: labelled stats group, not a form fieldset */}
					<div
						class="shrink-0 text-right"
						role="group"
						aria-label={`${local.stats?.count} ${local.stats?.label ?? ""}`}
					>
						<div class="font-semibold tabular-nums text-foreground">{local.stats?.count}</div>
						<div class="text-2xs text-muted-foreground">{local.stats?.label}</div>
					</div>
				</Show>
			</div>
			<Show when={link()}>
				<div class="flex items-center gap-2">
					<code class="min-w-0 flex-1 truncate rounded-md border border-border bg-muted px-2 py-1.5 font-mono text-xs text-foreground">
						{link()}
					</code>
					<button
						type="button"
						class="h-8 shrink-0 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
						onClick={copy}
						aria-live="polite"
					>
						{copied() ? "Copied" : "Copy"}
					</button>
				</div>
			</Show>
		</div>
	);
}
