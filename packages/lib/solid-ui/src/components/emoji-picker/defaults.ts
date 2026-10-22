/** Emoji model + built-in categories for `EmojiPicker`. */

/** An emoji entry — bare string or labelled object enabling keyword search. */
export type EmojiItem = string | { emoji: string; name?: string; keywords?: string[] };

export interface EmojiCategory {
	name: string;
	/** Optional icon/emoji for the category nav. */
	icon?: string;
	emojis: EmojiItem[];
}

export const itemEmoji = (i: EmojiItem) => (typeof i === "string" ? i : i.emoji);
export const itemMatches = (i: EmojiItem, q: string) => {
	if (typeof i === "string") return false;
	const hay = [i.name ?? "", ...(i.keywords ?? [])].join(" ").toLowerCase();
	return hay.includes(q);
};

export const EMOJI_DEFAULTS: EmojiCategory[] = [
	{
		name: "Smileys",
		icon: "😀",
		emojis: [
			{ emoji: "😀", name: "grinning" },
			{ emoji: "😄", name: "smile" },
			{ emoji: "😂", name: "joy", keywords: ["laugh", "tears"] },
			{ emoji: "🤣", name: "rofl" },
			{ emoji: "😊", name: "blush" },
			{ emoji: "😍", name: "heart eyes" },
			{ emoji: "🥰", name: "smiling hearts" },
			{ emoji: "😎", name: "cool", keywords: ["sunglasses"] },
			{ emoji: "🤔", name: "thinking" },
			{ emoji: "😴", name: "sleeping" },
			{ emoji: "🤯", name: "mind blown" },
			{ emoji: "🥳", name: "party" },
		],
	},
	{
		name: "Gestures",
		icon: "👍",
		emojis: [
			{ emoji: "👍", name: "thumbs up", keywords: ["like", "yes"] },
			{ emoji: "👎", name: "thumbs down", keywords: ["dislike", "no"] },
			{ emoji: "👏", name: "clap" },
			{ emoji: "🙌", name: "raised hands" },
			{ emoji: "🤝", name: "handshake" },
			{ emoji: "✌️", name: "victory", keywords: ["peace"] },
			{ emoji: "🫶", name: "heart hands" },
			{ emoji: "💪", name: "muscle", keywords: ["strong"] },
		],
	},
	{
		name: "Hearts",
		icon: "❤️",
		emojis: [
			{ emoji: "❤️", name: "red heart", keywords: ["love"] },
			{ emoji: "🧡", name: "orange heart" },
			{ emoji: "💛", name: "yellow heart" },
			{ emoji: "💚", name: "green heart" },
			{ emoji: "💙", name: "blue heart" },
			{ emoji: "💜", name: "purple heart" },
			{ emoji: "🖤", name: "black heart" },
			{ emoji: "💖", name: "sparkling heart" },
		],
	},
	{
		name: "Objects",
		icon: "🔥",
		emojis: [
			{ emoji: "🔥", name: "fire", keywords: ["hot"] },
			{ emoji: "✨", name: "sparkles" },
			{ emoji: "🎉", name: "party popper", keywords: ["celebrate", "tada"] },
			{ emoji: "🚀", name: "rocket", keywords: ["launch", "ship"] },
			{ emoji: "💡", name: "light bulb", keywords: ["idea"] },
			{ emoji: "📌", name: "pin" },
			{ emoji: "✅", name: "check", keywords: ["done"] },
			{ emoji: "⚡", name: "zap", keywords: ["lightning", "fast"] },
		],
	},
];
