import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { ActivityTab } from "../cloud/ActivityTab";
import { OverviewTab } from "../cloud/OverviewTab";
import { ServicesTab } from "../cloud/ServicesTab";
import { CloudFrame } from "../shell/CloudFrame";

export const Route = createFileRoute("/")({ component: CloudApp });

const TABS = [
	{ id: "overview", label: "Overview", icon: "i-mdi:view-dashboard-outline" },
	{ id: "services", label: "Services", icon: "i-mdi:apps" },
	{ id: "activity", label: "Activity", icon: "i-mdi:pulse" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function CloudApp() {
	const [tab, setTab] = createSignal<TabId>("overview");

	return (
		<CloudFrame>
			<div class="mb-6 flex gap-1 overflow-x-auto border-b border-edge">
				<For each={TABS}>
					{(item) => (
						<a
							href={`#${item.id}`}
							aria-current={tab() === item.id ? "page" : undefined}
							onClick={(event) => {
								event.preventDefault();
								setTab(item.id);
							}}
							class={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
								tab() === item.id
									? "border-acc font-medium text-acc"
									: "border-transparent text-dim hover:border-edge hover:text-fg"
							}`}
						>
							<span class={`${item.icon} text-base`} />
							{item.label}
						</a>
					)}
				</For>
			</div>
			<Show when={tab() === "overview"}>
				<OverviewTab />
			</Show>
			<Show when={tab() === "services"}>
				<ServicesTab />
			</Show>
			<Show when={tab() === "activity"}>
				<ActivityTab />
			</Show>
		</CloudFrame>
	);
}
