import { type Accessor, createMemo, createSignal } from "solid-js";

export interface CommandItem {
	/** Unique id — also the key stored in the recents list */
	id: string;
	/** Primary match text shown in the palette */
	label: string;
	/** Extra match terms — searched alongside `label` */
	keywords?: string[];
	/** Action executed by `select()` */
	run: () => void;
}

export interface CommandOptions {
	/** localStorage key for the recents list — omitted disables persistence */
	recentsKey?: string;
	/** Max items kept in the recents list. @default 5 */
	maxRecents?: number;
}

export interface CommandControls<T extends CommandItem = CommandItem> {
	/** Current query text */
	query: Accessor<string>;
	/** Update the query — resets `activeIndex` to 0 */
	setQuery: (query: string) => void;
	/** Ranked results — fuzzy-scored while typing, recents-first when empty */
	results: Accessor<T[]>;
	/** Highlighted index within `results` — clamped to the list */
	activeIndex: Accessor<number>;
	/** Move the highlight by `dir` steps — wraps around both ends */
	move: (dir: number) => void;
	/** Run an item (default: the highlighted one) and push it to recents */
	select: (item?: T) => void;
}

const CONSECUTIVE_BONUS = 4;
const BOUNDARY_BONUS = 3;
const CAMEL_BONUS = 2;

/**
 * Subsequence fuzzy score — every query char must appear in `text` in order.
 * Consecutive matches and word/camelCase boundaries score higher; longer
 * texts are slightly penalised. Returns -1 when `query` is not a subsequence.
 */
export function fuzzyScore(text: string, query: string): number {
	if (!query) return 0;
	const t = text.toLowerCase();
	const q = query.toLowerCase();
	let from = 0;
	let last = -2;
	let score = 0;
	for (const ch of q) {
		const at = t.indexOf(ch, from);
		if (at === -1) return -1;
		score += 1;
		if (at === last + 1) score += CONSECUTIVE_BONUS;
		if (at === 0 || /[\s\-_./\\]/.test(t[at - 1] ?? "")) score += BOUNDARY_BONUS;
		else if ((text[at] ?? "") >= "A" && (text[at] ?? "") <= "Z") score += CAMEL_BONUS;
		last = at;
		from = at + 1;
	}
	return score - t.length * 0.01;
}

const itemScore = <T extends CommandItem>(item: T, query: string): number => {
	const label = fuzzyScore(item.label, query);
	const kw = item.keywords?.reduce((best, k) => Math.max(best, fuzzyScore(k, query)), -1) ?? -1;
	return Math.max(label, kw);
};

/**
 * Command-palette state — fuzzy subsequence ranking over `label` +
 * `keywords`, arrow-key highlight via `move`, and `select` that runs the
 * item and records it in a localStorage recents list (`recentsKey`) which
 * floats to the top while the query is empty.
 *
 * @param items — Palette entries, static or reactive accessor
 * @param options — `recentsKey`/`maxRecents`
 * @returns `{ query, setQuery, results, activeIndex, move, select }`
 *
 * @example
 * const cmd = useCommand(actions, { recentsKey: "palette" });
 * <input value={cmd.query()} onInput={(e) => cmd.setQuery(e.currentTarget.value)}
 *   onKeyDown={(e) => e.key === "Enter" ? cmd.select() : e.key === "ArrowDown" ? cmd.move(1) : e.key === "ArrowUp" && cmd.move(-1)} />
 * <For each={cmd.results()}>{(a, i) => <li class={i() === cmd.activeIndex() ? "on" : ""}>{a.label}</li>}</For>
 */
export function useCommand<T extends CommandItem>(
	items: T[] | Accessor<T[]>,
	options?: CommandOptions,
): CommandControls<T> {
	const list = () => (typeof items === "function" ? (items as Accessor<T[]>)() : items);
	const maxRecents = options?.maxRecents ?? 5;
	const [query, setQueryRaw] = createSignal("");
	const [active, setActiveRaw] = createSignal(0);
	const [recents, setRecents] = createSignal<string[]>(load());

	function load(): string[] {
		const key = options?.recentsKey;
		if (!key || typeof localStorage === "undefined") return [];
		try {
			const raw = localStorage.getItem(key);
			const parsed = raw ? JSON.parse(raw) : [];
			return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
		} catch {
			return [];
		}
	}

	const remember = (id: string) => {
		const key = options?.recentsKey;
		const next = [id, ...recents().filter((r) => r !== id)].slice(0, maxRecents);
		setRecents(next);
		if (!key || typeof localStorage === "undefined") return;
		try {
			localStorage.setItem(key, JSON.stringify(next));
		} catch {
			/* storage full / blocked — recents stay in memory */
		}
	};

	const results = createMemo(() => {
		const q = query().trim();
		const rank = recents();
		const recentRank = (id: string) => {
			const i = rank.indexOf(id);
			return i === -1 ? rank.length : i;
		};
		if (!q) {
			return [...list()].sort((a, b) => recentRank(a.id) - recentRank(b.id) || a.label.localeCompare(b.label));
		}
		return list()
			.map((item) => ({ item, score: itemScore(item, q) }))
			.filter(({ score }) => score >= 0)
			.sort(
				(a, b) =>
					b.score - a.score ||
					recentRank(a.item.id) - recentRank(b.item.id) ||
					a.item.label.localeCompare(b.item.label),
			)
			.map(({ item }) => item);
	});

	const clamp = (n: number) => {
		const len = results().length;
		return len === 0 ? 0 : Math.min(Math.max(0, n), len - 1);
	};

	return {
		query,
		setQuery: (q) => {
			setQueryRaw(q);
			setActiveRaw(0);
		},
		results,
		activeIndex: createMemo(() => clamp(active())),
		move: (dir) => {
			const len = results().length;
			if (len === 0) return;
			setActiveRaw((((active() + dir) % len) + len) % len);
		},
		select: (item) => {
			const target = item ?? results()[clamp(active())];
			if (!target) return;
			remember(target.id);
			target.run();
		},
	};
}
