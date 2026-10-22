/**
 * LicenseCard — license summary: type, masked key with reveal toggle, seat usage bar and renew link.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface LicenseCardLicense {
	/** License tier label, e.g. "Pro". */
	type: string;
	/** Full license key — masked by default. */
	key: string;
	/** Total seat count. */
	seats: number;
	/** Seats currently in use. */
	used: number;
	/** Expiry date text, e.g. "Dec 31, 2026". */
	expiresAt?: string;
}

export interface LicenseCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** License to render. */
	license?: LicenseCardLicense;
	/** URL for the "Renew" link. */
	renewHref?: string;
	/** Called when "Renew" is clicked (rendered as a button when no href). */
	onRenew?: (license: LicenseCardLicense) => void;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function LicenseCard(props: LicenseCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"license",
		"renewHref",
		"onRenew",
		"variant",
		"radius",
		"elevation",
	]);
	const [revealed, setRevealed] = createSignal(false);
	const masked = () => `•••• •••• •••• ${local.license?.key?.slice(-4)}`;
	const pct = () =>
		(local.license?.seats ?? 0) > 0
			? Math.min(100, Math.round(((local.license?.used ?? 0) / (local.license?.seats ?? 1)) * 100))
			: 0;
	const barCls = () => (pct() >= 100 ? "bg-destructive" : pct() >= 80 ? "bg-warning" : "bg-primary");
	return (
		<div
			class={`solidui-license-card border p-4 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center justify-between gap-2">
				<span class="text-sm font-semibold text-foreground">{local.license?.type} license</span>
				<Show when={local.license?.expiresAt}>
					<span class="text-2xs text-muted-foreground">Expires {local.license?.expiresAt}</span>
				</Show>
			</div>
			<div class="mt-3 flex items-center gap-2">
				<code class="min-w-0 flex-1 truncate rounded border border-border bg-muted/40 px-2 py-1 font-mono text-xs text-foreground">
					{revealed() ? local.license?.key : masked()}
				</code>
				<button
					type="button"
					class="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={revealed() ? "Hide license key" : "Reveal license key"}
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
			</div>
			<div class="mt-3">
				<div class="flex items-center justify-between text-2xs text-muted-foreground">
					<span>
						<span class="font-semibold tabular-nums text-foreground">{local.license?.used}</span> of{" "}
						<span class="tabular-nums">{local.license?.seats}</span> seats used
					</span>
					<span class="tabular-nums">{pct()}%</span>
				</div>
				<div
					class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
					role="progressbar"
					aria-valuenow={pct()}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label="Seats used"
				>
					<div class={`h-full rounded-full ${barCls()}`} style={{ width: `${pct()}%` }} />
				</div>
			</div>
			<Show when={local.renewHref || local.onRenew}>
				<div class="mt-3 flex justify-end">
					<Show
						when={local.renewHref}
						fallback={
							<button
								type="button"
								class="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								onClick={() => local.license && local.onRenew?.(local.license)}
							>
								Renew license
							</button>
						}
					>
						<a
							href={local.renewHref}
							class="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Renew license
						</a>
					</Show>
				</div>
			</Show>
		</div>
	);
}
