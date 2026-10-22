/**
 * RegexBuilder segment vocabulary — segment kinds, regex fragments and labels.
 */

export type RegexSegmentKind = "start" | "end" | "digits" | "letters" | "whitespace" | "word" | "literal";

export interface RegexSegment {
	/** Segment type. */
	kind: RegexSegmentKind;
	/** Literal text — used when `kind` is `"literal"`. */
	value?: string;
}

export const KINDS: { kind: RegexSegmentKind; label: string }[] = [
	{ kind: "start", label: "Starts with" },
	{ kind: "end", label: "Ends with" },
	{ kind: "digits", label: "Digits" },
	{ kind: "letters", label: "Letters" },
	{ kind: "whitespace", label: "Whitespace" },
	{ kind: "word", label: "Word chars" },
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function segmentFragment(s: RegexSegment): string {
	switch (s.kind) {
		case "start":
			return "^";
		case "end":
			return "$";
		case "digits":
			return "\\d+";
		case "letters":
			return "[a-zA-Z]+";
		case "whitespace":
			return "\\s+";
		case "word":
			return "\\w+";
		case "literal":
			return escapeRe(s.value ?? "");
	}
}

export function segmentLabel(s: RegexSegment): string {
	if (s.kind === "literal") return `Literal "${s.value ?? ""}"`;
	return KINDS.find((k) => k.kind === s.kind)?.label ?? s.kind;
}
