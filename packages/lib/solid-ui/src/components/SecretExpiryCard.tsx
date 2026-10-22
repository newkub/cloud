/**
 * SecretExpiryCard - secret expiry countdown card with tone and a rotation link.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SecretExpiryCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Secret name/path. */
	name: string;
	/** Expiry instant — Date, epoch ms, or a date string. */
	expiresAt: Date | number | string;
	/** When set, renders a "Rotate" action link. */
	rotationUrl?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

type Tone = "success" | "warning" | "destructive" | "muted";

const textCls: Record<Tone, string> = {
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	muted: "text-muted-foreground",
};

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

const DAY_MS = 86_400_000;

const fmtDate = (v: Date | number | string) => {
	const t = new Date(v).getTime();
	return Number.isNaN(t)
		? String(v)
		: new Date(t).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

export function SecretExpiryCard(props: SecretExpiryCardProps) {
	const [local, restProps] = splitProps(props, ["name", "expiresAt", "rotationUrl", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-secret-expiry-card border p-4 transition-shadow hover:shadow-md motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "xl" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const expiryMs = () => new Date(local.expiresAt).getTime();
	const days = () => Math.ceil((expiryMs() - Date.now()) / DAY_MS);
	const tone = (): Tone => {
		if (Number.isNaN(expiryMs())) return "muted";
		const d = days();
		if (d < 0) return "destructive";
		if (d <= 7) return "warning";
		return "success";
	};
	const label = () => {
		if (Number.isNaN(expiryMs())) return "—";
		const d = days();
		if (d < 0) return "Expired";
		if (d === 0) return "Today";
		return `${d}d`;
	};
	const caption = () => {
		if (Number.isNaN(expiryMs())) return "unknown expiry";
		const d = days();
		if (d < 0) return `${-d}d overdue`;
		return d === 0 ? "expires today" : "remaining";
	};
	const statusWord = () => {
		const t = tone();
		if (t === "destructive") return "Action required";
		if (t === "warning") return "Rotate soon";
		if (t === "muted") return "Unscheduled";
		return "Healthy";
	};

	return (
		<div class={className()} {...rest}>
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="truncate font-mono text-sm font-medium text-foreground">{local.name}</div>
					<div class="mt-0.5 text-2xs text-muted-foreground">Expires {fmtDate(local.expiresAt)}</div>
				</div>
				<div class="shrink-0 text-right">
					<div class={`text-lg font-bold leading-none tabular-nums ${textCls[tone()]}`}>{label()}</div>
					<div class="mt-0.5 text-2xs text-muted-foreground">{caption()}</div>
				</div>
			</div>
			<div class="mt-3 flex items-center justify-between border-t border-border pt-2.5">
				<span class={`text-2xs font-medium ${textCls[tone()]}`}>{statusWord()}</span>
				<Show when={local.rotationUrl}>
					<a
						href={local.rotationUrl}
						class="text-2xs font-medium text-primary underline-offset-2 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none"
					>
						Rotate secret →
					</a>
				</Show>
			</div>
			{local.children}
		</div>
	);
}
