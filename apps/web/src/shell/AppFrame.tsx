import { For, type JSX, Show } from "solid-js";
import { StatusBadge } from "../components/StatusBadge";
import type { ProductStatus } from "../data/products";
import type { AppTabItem } from "./apps";

export interface AppFrameProps {
	icon: string;
	name: string;
	description?: string;
	status?: ProductStatus;
	live?: boolean;
	tabs: AppTabItem[];
	actions?: JSX.Element;
	children: JSX.Element;
}

export function AppFrame(props: AppFrameProps) {
	return (
		<div class="flex min-h-full flex-col">
			<header class="shrink-0 border-b border-edge bg-panel/40">
				<div class="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
					<div class="flex flex-wrap items-start gap-3">
						<span
							class={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-panel text-2xl ${
								props.live ? "text-acc" : "text-faint"
							}`}
						>
							<span class={props.icon} />
						</span>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<h1 class="text-xl font-semibold tracking-tight text-fg">
									{props.name}
								</h1>
								<Show when={props.status}>
									{(status) => <StatusBadge status={status()} />}
								</Show>
							</div>
							<Show when={props.description}>
								<p class="mt-0.5 max-w-3xl text-sm leading-relaxed text-dim">
									{props.description}
								</p>
							</Show>
						</div>
						<Show when={props.actions}>
							<div class="flex flex-wrap items-center gap-2">
								{props.actions}
							</div>
						</Show>
					</div>

					<nav
						aria-label={`${props.name} sections`}
						class="mt-5 flex gap-1 overflow-x-auto"
					>
						<For each={props.tabs}>
							{(tab) => (
								<a
									href={tab.href}
									aria-current={tab.active ? "page" : undefined}
									onClick={(event) => {
										event.preventDefault();
										tab.onSelect();
									}}
									class={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${
										tab.active
											? "border-acc font-medium text-acc"
											: "border-transparent text-dim hover:border-edge hover:text-fg"
									}`}
								>
									<span class={`${tab.icon} text-base`} />
									{tab.label}
								</a>
							)}
						</For>
					</nav>
				</div>
			</header>

			<div class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
				{props.children}
			</div>
		</div>
	);
}
