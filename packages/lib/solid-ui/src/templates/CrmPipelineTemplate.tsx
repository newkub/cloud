/**
 * CrmPipelineTemplate — starter sales workspace: KPI band, deal pipeline board and a triage inbox.
 */
import { Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { KanbanBoard, type KanbanBoardProps } from "../components/KanbanBoard";
import { InboxTriageBlock, type InboxItem } from "../blocks/InboxTriageBlock";
import { StatsBlock, type StatItem } from "../blocks/StatsBlock";

export interface CrmPipelineTemplateProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Workspace heading @default "Pipeline" */
	title?: string;
	/** Supporting text under the heading. */
	subtitle?: string;
	/** KPI band above the board. */
	stats?: StatItem[];
	/** Pipeline columns — each card is a deal. */
	columns: KanbanBoardProps["columns"];
	/** Called when a deal card is opened. */
	onCardClick?: KanbanBoardProps["onCardClick"];
	/** Called after a deal is dropped into another stage. */
	onCardMove?: KanbanBoardProps["onCardMove"];
	/** Optional inbox rail rendered beside the board. */
	inbox?: InboxItem[];
	onArchiveMessage?: (ids: string[]) => void;
	onSnoozeMessage?: (ids: string[]) => void;
	onOpenMessage?: (item: InboxItem) => void;
	onImport?: () => void;
	onNewDeal?: () => void;
}

export function CrmPipelineTemplate(props: CrmPipelineTemplateProps) {
	return (
		<div class={`flex flex-col gap-6 ${props.class ?? ""}`}>
			<header class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 class="text-xl font-semibold tracking-tight text-foreground">
						{props.title ?? "Pipeline"}
					</h1>
					<Show when={props.subtitle}>
						<p class="mt-1 text-sm text-muted-foreground">{props.subtitle}</p>
					</Show>
				</div>
				<div class="flex gap-2">
					<Show when={props.onImport}>
						<Button type="button" variant="secondary" size="sm" onClick={props.onImport}>
							Import deals
						</Button>
					</Show>
					<Show when={props.onNewDeal}>
						<Button type="button" variant="primary" size="sm" onClick={props.onNewDeal}>
							New deal
						</Button>
					</Show>
				</div>
			</header>

			<Show when={(props.stats?.length ?? 0) > 0}>
				<StatsBlock stats={props.stats ?? []} />
			</Show>

			<div class="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
				<section class="min-w-0">
					<h2 class="mb-3 text-sm font-semibold text-foreground">Deals by stage</h2>
					<KanbanBoard
						columns={props.columns}
						onCardClick={props.onCardClick}
						onCardMove={props.onCardMove}
						size="sm"
						emptyText="No deals in this stage"
					/>
				</section>

				<Show when={(props.inbox?.length ?? 0) > 0}>
					<section class="min-w-0">
						<InboxTriageBlock
							title="Inbox"
							items={props.inbox ?? []}
							onArchive={props.onArchiveMessage}
							onSnooze={props.onSnoozeMessage}
							onOpen={props.onOpenMessage}
						/>
					</section>
				</Show>
			</div>
		</div>
	);
}
