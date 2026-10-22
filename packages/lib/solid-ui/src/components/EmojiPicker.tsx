/**
 * EmojiPicker — emoji grid picker with categories, search and recents.
 * The emoji model and built-in categories live in `./emoji-picker/defaults`
 * and are re-exported here so `from "./EmojiPicker"` keeps working.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { EMOJI_DEFAULTS, type EmojiCategory, type EmojiItem, itemEmoji, itemMatches } from "./emoji-picker/defaults";

export { EMOJI_DEFAULTS, type EmojiCategory, type EmojiItem } from "./emoji-picker/defaults";

export interface EmojiPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	onPick?: (emoji: string) => void;
	/** Alias for `onPick`. */
	onSelect?: (emoji: string) => void;
	categories?: EmojiCategory[];
	/** Search box — filters object entries by name/keywords. @default true */
	searchable?: boolean;
	/** Search input placeholder. @default "Search emoji…" */
	searchPlaceholder?: string;
	/** Category icon nav — jumps to a section. @default true (with >1 category) */
	showCategoryNav?: boolean;
	/** Recently-used row — provide keys to enable. */
	recent?: string[];
	/** Track picks as recents internally and merge them into the Recent row. @default true */
	trackRecents?: boolean;
	/** Called with the updated recents list after each pick. */
	onRecentChange?: (recent: string[]) => void;
	/** Max recent entries remembered via onPick. @default 8 */
	maxRecent?: number;
	/** Empty-state text when a search matches nothing. @default "No emoji found" */
	emptyText?: string;
	/** Grid columns. @default 8 */
	columns?: number;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	disabled?: boolean;
}

const cellSize = { sm: "h-7 w-7 text-sm", md: "h-8 w-8 text-base", lg: "h-9 w-9 text-lg" } as const;

export function EmojiPicker(props: EmojiPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"onPick",
		"onSelect",
		"categories",
		"searchable",
		"searchPlaceholder",
		"showCategoryNav",
		"recent",
		"trackRecents",
		"onRecentChange",
		"maxRecent",
		"emptyText",
		"columns",
		"size",
		"variant",
		"radius",
		"elevation",
		"disabled",
	]);
	const [q, setQ] = createSignal("");
	const [recentPicks, setRecentPicks] = createSignal<string[]>([]);
	const cats = () => local.categories ?? EMOJI_DEFAULTS;

	const recents = () => {
		const merged = [...(local.recent ?? []), ...recentPicks()];
		return [...new Set(merged)].slice(0, local.maxRecent ?? 8);
	};

	const filteredCats = (): EmojiCategory[] => {
		const query = q().trim().toLowerCase();
		if (!query) return cats();
		return cats()
			.map((c) => ({
				...c,
				emojis: c.emojis.filter((e) => itemMatches(e, query) || itemEmoji(e) === query),
			}))
			.filter((c) => c.emojis.length > 0);
	};

	const sections = (): EmojiCategory[] => {
		if (q().trim()) return filteredCats();
		return [...(recents().length ? [{ name: "Recent", icon: "🕘", emojis: recents() }] : []), ...cats()];
	};
	const pick = (emoji: string) => {
		if (local.disabled) return;
		if (local.trackRecents ?? true) {
			const next = [emoji, ...recentPicks().filter((e) => e !== emoji)].slice(0, local.maxRecent ?? 8);
			setRecentPicks(next);
			local.onRecentChange?.(next);
		}
		local.onPick?.(emoji);
		local.onSelect?.(emoji);
	};

	const jumpTo = (name: string) => {
		const escaped = typeof CSS === "undefined" ? name.replace(/"/g, '\\"') : CSS.escape(name);
		const el = scrollEl?.querySelector(`[data-emoji-cat="${escaped}"]`);
		el?.scrollIntoView?.({ block: "start" });
	};
	let scrollEl: HTMLDivElement | undefined;

	const cell = (item: EmojiItem) => {
		const e = itemEmoji(item);
		const title = typeof item === "string" ? undefined : item.name;
		return (
			<button
				type="button"
				disabled={local.disabled}
				title={title}
				aria-label={title ? `Insert ${title}` : `Insert ${e}`}
				class={`flex items-center justify-center rounded-md motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${cellSize[local.size ?? "md"]}`}
				onClick={() => pick(e)}
			>
				{e}
			</button>
		);
	};

	return (
		<div
			class={`solidui-emoji-picker w-64 max-w-full ${surfaceVariants[local.variant ?? "default"]} p-2 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.searchable ?? true}>
				<input
					type="text"
					value={q()}
					placeholder={local.searchPlaceholder ?? "Search emoji…"}
					aria-label="Search emoji"
					disabled={local.disabled}
					class="mb-2 h-7 w-full rounded-md border border-border bg-transparent px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onInput={(e) => setQ(e.currentTarget.value)}
				/>
			</Show>
			<Show when={(local.showCategoryNav ?? true) && !q().trim() && cats().length > 1}>
				<nav class="mb-1 flex flex-wrap gap-0.5 border-b border-border pb-1" aria-label="Emoji categories">
					<For each={cats()}>
						{(c) => (
							<button
								type="button"
								disabled={local.disabled}
								title={c.name}
								aria-label={`Jump to ${c.name}`}
								class="flex h-6 w-6 items-center justify-center rounded text-sm motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
								onClick={() => jumpTo(c.name)}
							>
								{c.icon ?? c.emojis.map(itemEmoji)[0] ?? "•"}
							</button>
						)}
					</For>
				</nav>
			</Show>
			<div class="max-h-56 overflow-y-auto" ref={scrollEl}>
				<For
					each={sections()}
					fallback={
						<div class="px-2 py-3 text-center text-xs text-muted-foreground">{local.emptyText ?? "No emoji found"}</div>
					}
				>
					{(cat) => (
						<div data-emoji-cat={cat.name}>
							<div class="px-1 pb-1 pt-1.5 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
								{cat.name}
							</div>
							<div class="grid" style={{ "grid-template-columns": `repeat(${local.columns ?? 8}, 1fr)` }}>
								<For each={cat.emojis}>{cell}</For>
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
