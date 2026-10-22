/**
 * TlsExpiryCard - TLS certificate expiry card: countdown, issuer and ok/warn/critical tone.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type TlsExpiryTone = "ok" | "warn" | "critical";

export interface TlsExpiryCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Domain the certificate covers. */
	domain: string;
	/** Issuing CA, e.g. "Let's Encrypt". */
	issuer?: string;
	/** Expiry timestamp — epoch ms, ISO string or Date. */
	expiresAt: number | string | Date;
	/** Days until expiry — auto-computed from `expiresAt` when omitted. */
	daysLeft?: number;
	/** Days at or below which the tone becomes "warn". @default 30 */
	warnAt?: number;
	/** Days at or below which the tone becomes "critical". @default 7 */
	criticalAt?: number;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const MS_PER_DAY = 86_400_000;

const toneText: Record<TlsExpiryTone, string> = {
	ok: "text-success",
	warn: "text-warning",
	critical: "text-destructive",
};

const toneBar: Record<TlsExpiryTone, string> = {
	ok: "bg-success",
	warn: "bg-warning",
	critical: "bg-destructive",
};

const toneChip: Record<TlsExpiryTone, string> = {
	ok: "border-success/30 bg-success/10 text-success",
	warn: "border-warning/30 bg-warning/10 text-warning",
	critical: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function TlsExpiryCard(props: TlsExpiryCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"domain",
		"issuer",
		"expiresAt",
		"daysLeft",
		"warnAt",
		"criticalAt",
		"variant",
		"radius",
		"elevation",
		"unstyled",
	]);

	const days = () => {
		if (local.daysLeft !== undefined) return local.daysLeft;
		const t = new Date(local.expiresAt).getTime();
		if (Number.isNaN(t)) return 0;
		return Math.ceil((t - Date.now()) / MS_PER_DAY);
	};

	const tone = (): TlsExpiryTone => {
		const d = days();
		if (d <= (local.criticalAt ?? 7)) return "critical";
		if (d <= (local.warnAt ?? 30)) return "warn";
		return "ok";
	};

	const expiryLabel = () => {
		const t = new Date(local.expiresAt).getTime();
		return Number.isNaN(t) ? String(local.expiresAt) : new Date(t).toLocaleDateString();
	};

	/** Bar fraction — 100% at warnAt days or more, scaled down to 0. */
	const barPct = () => Math.max(0, Math.min(100, (days() / (local.warnAt ?? 30)) * 100));

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-tls-expiry-card border",
					surfaceVariants[local.variant ?? "default"],
					"p-4",
					radiusMap[local.radius ?? "lg"],
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-1.5">
						<NamedIcon name="lock" class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
						<span class="truncate font-mono text-sm font-medium text-foreground">{local.domain}</span>
					</div>
					<Show when={local.issuer}>
						<div class="mt-0.5 truncate text-xs text-muted-foreground">Issued by {local.issuer}</div>
					</Show>
				</div>
				<span class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-medium capitalize ${toneChip[tone()]}`}>
					{tone()}
				</span>
			</div>
			<div class="mt-3 flex items-baseline gap-2">
				<span class={`text-2xl font-semibold tabular-nums ${toneText[tone()]}`}>
					{days() < 0 ? "Expired" : `${days()}`}
				</span>
				<Show when={days() >= 0}>
					<span class="text-xs text-muted-foreground">{days() === 1 ? "day left" : "days left"}</span>
				</Show>
			</div>
			<div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted" role="presentation">
				<div class={`h-full rounded-full ${toneBar[tone()]}`} style={{ width: `${barPct()}%` }} />
			</div>
			<div class="mt-2 text-2xs tabular-nums text-muted-foreground">Expires {expiryLabel()}</div>
		</div>
	);
}
