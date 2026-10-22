/**
 * KanbanBoard — draggable columns of cards with counts and move callbacks.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface KanbanCard {
	id: string;
	title: string;
	/** Optional small label shown above the title. */
	label?: string;
	/** Muted detail line under the title. */
	description?: string;
}

export interface KanbanColumn {
	id: string;
	title: string;
	cards: KanbanCard[];
	/** Accent class applied to the column header dot, e.g. "bg-primary". */
	color?: string;
	/** Cap visible cards — overflow is collapsed into a "+N more" row. */
	limit?: number;
}

export interface KanbanBoardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	columns: KanbanColumn[];
	/** Enable HTML5 drag/drop between columns. @default true */
	draggable?: boolean;
	onCardClick?: (card: KanbanCard, column: KanbanColumn) => void;
	/** Called after a card is dropped onto another column (or the same one). */
	onCardMove?: (cardId: string, from: string, to: string) => void;
	/** Empty-column placeholder text. */
	emptyText?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius on columns and cards. */
	radius?: Radius;
	/** Shadow elevation on cards. */
	elevation?: Elevation;
}

const pad = { sm: "p-2", md: "p-3", lg: "p-4" } as const;
const cardText = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function KanbanBoard(props: KanbanBoardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"draggable",
		"onCardClick",
		"onCardMove",
		"emptyText",
		"size",
		"radius",
		"elevation",
	]);
	const [dragId, setDragId] = createSignal<string | null>(null);
	const [overCol, setOverCol] = createSignal<string | null>(null);
	const dragFrom = { col: "" };

	return (
		<div class={`solidui-kanban-board flex items-start gap-3 overflow-x-auto ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.columns}>
				{(col) => {
					const visible = () => (col.limit ? col.cards.slice(0, col.limit) : col.cards);
					const hidden = () => col.cards.length - visible().length;
					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: drag/drop target — pointer-only interaction
						<div
							class={`w-64 shrink-0 border border-border bg-muted/40 ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${
								overCol() === col.id ? "ring-1 ring-primary/40" : ""
							}`.trim()}
							onDragOver={(e) => {
								if ((local.draggable ?? true) && dragId()) {
									e.preventDefault();
									setOverCol(col.id);
								}
							}}
							onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
							onDrop={(e) => {
								e.preventDefault();
								const id = dragId();
								if (id) local.onCardMove?.(id, dragFrom.col, col.id);
								setDragId(null);
								setOverCol(null);
							}}
						>
							<div class="mb-3 flex items-center gap-2">
								<span class={`h-2 w-2 shrink-0 rounded-full ${col.color ?? "bg-muted-foreground/50"}`} />
								<span class="min-w-0 truncate text-xs font-semibold text-foreground">{col.title}</span>
								<span class="ml-auto shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-2xs tabular-nums text-muted-foreground">
									{col.cards.length}
								</span>
							</div>
							<div class="space-y-2">
								<For each={visible()}>
									{(card) => (
										// biome-ignore lint/a11y/useSemanticElements: draggable card needs div semantics for HTML5 drag/drop
										<div
											role="button"
											tabIndex={0}
											class={`border border-border bg-surface ${pad[local.size ?? "md"]} ${
												cardText[local.size ?? "md"]
											} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : "shadow-sm"} ${
												dragId() === card.id ? "opacity-50" : ""
											} ${(local.draggable ?? true) ? "cursor-grab active:cursor-grabbing" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.trim()}
											draggable={local.draggable ?? true}
											onDragStart={() => {
												setDragId(card.id);
												dragFrom.col = col.id;
											}}
											onDragEnd={() => setDragId(null)}
											onClick={() => local.onCardClick?.(card, col)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													local.onCardClick?.(card, col);
												}
											}}
										>
											<Show when={card.label}>
												<div class="mb-1 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
													{card.label}
												</div>
											</Show>
											<div class="font-medium text-foreground">{card.title}</div>
											<Show when={card.description}>
												<div class="mt-0.5 text-xs text-muted-foreground">{card.description}</div>
											</Show>
										</div>
									)}
								</For>
								<Show when={hidden() > 0}>
									<div class="px-1 text-2xs text-muted-foreground">+{hidden()} more</div>
								</Show>
								<Show when={col.cards.length === 0}>
									<div class="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
										{local.emptyText ?? "No cards"}
									</div>
								</Show>
							</div>
						</div>
					);
				}}
			</For>
		</div>
	);
}
