import {
	Alert,
	Badge,
	Skeleton,
	Card as SurfaceCard,
	EmptyState as UiEmptyState,
	PageHeader as UiPageHeader,
} from "@wrikka/solid-ui";
import { type JSX, type ParentProps, Show } from "solid-js";
import type { HealRecord, RunRecord } from "./api";

const RUN_STATUS: Record<
	RunRecord["status"],
	{
		label: string;
		icon: string;
		variant: "outline" | "success" | "destructive" | "warning" | "primary";
	}
> = {
	running: {
		label: "Running",
		icon: "i-mdi:progress-clock",
		variant: "outline",
	},
	success: { label: "Success", icon: "i-mdi:check-circle", variant: "success" },
	failed: {
		label: "Failed",
		icon: "i-mdi:close-circle",
		variant: "destructive",
	},
	healing: { label: "Healing", icon: "i-mdi:bandage", variant: "warning" },
	healed: { label: "Healed", icon: "i-mdi:auto-fix", variant: "primary" },
	heal_failed: {
		label: "Heal failed",
		icon: "i-mdi:alert-octagon",
		variant: "destructive",
	},
};

const HEAL_STATUS: Record<
	HealRecord["status"],
	{
		label: string;
		icon: string;
		variant: "primary" | "warning" | "destructive";
	}
> = {
	running: { label: "Healing", icon: "i-mdi:bandage", variant: "warning" },
	pushed: {
		label: "Fix pushed",
		icon: "i-mdi:source-pull",
		variant: "primary",
	},
	failed: {
		label: "Failed",
		icon: "i-mdi:close-circle",
		variant: "destructive",
	},
};

export function StatusBadge(props: { status: RunRecord["status"] }) {
	const meta = () => RUN_STATUS[props.status];
	return (
		<Badge variant={meta().variant} class="gap-1.5">
			<span class={meta().icon} />
			{meta().label}
		</Badge>
	);
}

export function HealBadge(props: { status: HealRecord["status"] }) {
	const meta = () => HEAL_STATUS[props.status];
	return (
		<Badge variant={meta().variant} class="gap-1.5">
			<span class={meta().icon} />
			{meta().label}
		</Badge>
	);
}

export function Card(props: ParentProps<{ class?: string }>) {
	return (
		<SurfaceCard class={`p-5 ${props.class ?? ""}`}>
			{props.children}
		</SurfaceCard>
	);
}

export function StatCard(props: {
	label: string;
	value: JSX.Element | string | number;
	icon: string;
	hint?: string;
	accent?: "brand" | "emerald" | "violet" | "rose" | "sky";
}) {
	const accent = () => props.accent ?? "brand";
	const iconCls = () =>
		({
			brand: "bg-brand/15 text-brand",
			emerald: "bg-emerald-500/15 text-emerald-300",
			violet: "bg-violet-500/15 text-violet-300",
			rose: "bg-rose-500/15 text-rose-300",
			sky: "bg-sky-500/15 text-sky-300",
		})[accent()];
	return (
		<Card class="flex items-start gap-4">
			<div
				class={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconCls()}`}
			>
				<span class={`${props.icon} text-xl`} />
			</div>
			<div class="min-w-0">
				<div class="text-sm text-dim">{props.label}</div>
				<div class="truncate text-2xl font-semibold text-fg">{props.value}</div>
				<Show when={props.hint}>
					<div class="mt-0.5 text-xs text-faint">{props.hint}</div>
				</Show>
			</div>
		</Card>
	);
}

export function PageHeader(props: {
	title: string;
	description?: string;
	subtitle?: string;
	actions?: JSX.Element;
}) {
	return (
		<UiPageHeader
			title={props.title}
			description={props.description ?? props.subtitle}
			actions={props.actions}
			class="mb-6"
		/>
	);
}

export function EmptyState(props: {
	icon: string;
	title: string;
	hint?: string;
	action?: JSX.Element;
}) {
	return (
		<UiEmptyState
			variant="outline"
			class="rounded-xl"
			icon={<span class={props.icon} />}
			title={props.title}
			description={props.hint}
			action={props.action}
		/>
	);
}

export function Loading() {
	return (
		<div class="space-y-3" role="status" aria-busy="true" aria-label="Loading">
			<Skeleton shape="rect" class="h-20 rounded-xl" />
			<Skeleton shape="rect" class="h-20 rounded-xl" />
			<Skeleton shape="rect" class="h-20 rounded-xl" />
		</div>
	);
}

export function ErrorState(props: { message: string }) {
	return (
		<Alert variant="destructive" title="CI API unavailable">
			{props.message}
		</Alert>
	);
}

export function MetaRow(props: { label: string; children: JSX.Element }) {
	return (
		<div class="flex flex-col gap-1 border-b border-edge py-2.5 last:border-0 sm:flex-row sm:items-center sm:gap-4">
			<div class="w-36 shrink-0 text-sm text-faint">{props.label}</div>
			<div class="min-w-0 break-all text-sm text-fg">{props.children}</div>
		</div>
	);
}

export function LogBlock(props: { text: string }) {
	return (
		<pre class="mt-2 max-h-72 overflow-y-auto overflow-x-auto whitespace-pre-wrap rounded-lg border border-edge bg-ink p-3 font-mono text-xs text-dim">
			{props.text}
		</pre>
	);
}
