import { createMemo, createSignal, For, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { EmptyState } from "../components/EmptyState";
import { InboxRow } from "../components/InboxRow";
import { SelectionBar } from "../components/SelectionBar";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";

export interface InboxItem {
	id: string;
	from: string;
	subject: string;
	preview?: string;
	unread?: boolean;
	receivedAt?: string;
}

export interface InboxTriageBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	items: InboxItem[];
	onArchive?: (ids: string[]) => void;
	onSnooze?: (ids: string[]) => void;
	onOpen?: (item: InboxItem) => void;
}

/** A focused inbox with selection, batch archive/snooze and an unread filter. */
export function InboxTriageBlock(props: InboxTriageBlockProps) {
	const [selected, setSelected] = createSignal<string[]>([]);
	const [scope, setScope] = createSignal<"all" | "unread">("all");

	const visible = createMemo(() =>
		props.items.filter((item) => (scope() === "unread" ? item.unread : true)),
	);
	const unreadCount = createMemo(() => props.items.filter((item) => item.unread).length);
	const allChecked = () => visible().length > 0 && selected().length === visible().length;

	function toggle(id: string, checked: boolean) {
		setSelected((current) => (checked ? [...current, id] : current.filter((value) => value !== id)));
	}

	function act(action: (ids: string[]) => void) {
		action(selected());
		setSelected([]);
	}

	return (
		<div class={`flex flex-col gap-4 ${props.class ?? ""}`}>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<h2 class="text-lg font-semibold tracking-tight">{props.title ?? "Inbox"}</h2>
					<Show when={unreadCount() > 0}>
						<span class="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
							{unreadCount()}
						</span>
					</Show>
				</div>
				<Tabs
					value={scope()}
					onValueChange={(value) => {
						setScope(value === "unread" ? "unread" : "all");
						setSelected([]);
					}}
				>
					<TabsList variant="pills">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="unread">Unread</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Show when={selected().length > 0}>
				<SelectionBar
					count={selected().length}
					total={visible().length}
					onClear={() => setSelected([])}
					actions={
						<div class="flex gap-2">
							<Button size="sm" variant="secondary" onClick={() => act((ids) => props.onSnooze?.(ids))}>
								Snooze
							</Button>
							<Button size="sm" variant="primary" onClick={() => act((ids) => props.onArchive?.(ids))}>
								Archive
							</Button>
						</div>
					}
				/>
			</Show>

			<Show
				when={visible().length > 0}
				fallback={
					<EmptyState
						title={scope() === "unread" ? "Inbox zero" : "Nothing here"}
						description={scope() === "unread" ? "Every message has been read." : "New messages will land here."}
					/>
				}
			>
				<div class="flex flex-col gap-2">
					<Checkbox
						checked={allChecked()}
						onChange={(checked) => setSelected(checked ? visible().map((item) => item.id) : [])}
						label={`Select all ${visible().length}`}
					/>
					<For each={visible()}>
						{(item) => (
							<InboxRow
								from={item.from}
								subject={item.subject}
								preview={item.preview}
								unread={item.unread}
								hint={item.receivedAt}
								onClick={() => props.onOpen?.(item)}
								actions={
									<Checkbox
										checked={selected().includes(item.id)}
										onChange={(checked) => toggle(item.id, checked)}
										aria-label={`Select ${item.subject}`}
									/>
								}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
