/**
 * RegexBuilder matching helpers — compile the pattern, split the test string
 * into match/non-match parts and derive the status line.
 */

export type RegexResult = { state: "empty" } | { state: "invalid" } | { state: "ok"; re: RegExp };

/** Compile `pattern` with `flags` — `"empty"` for a blank pattern, `"invalid"` on a syntax error. */
export function compilePattern(pattern: string, flags: string): RegexResult {
	if (!pattern) return { state: "empty" };
	try {
		return { state: "ok", re: new RegExp(pattern, flags) };
	} catch {
		return { state: "invalid" };
	}
}

export interface MatchPart {
	text: string;
	match: boolean;
}

/** Split `text` into alternating non-match/match parts and count the matches. */
export function splitMatches(result: RegexResult, text: string): { parts: MatchPart[]; count: number } {
	const parts: MatchPart[] = [];
	if (result.state !== "ok" || !text) return { parts: text ? [{ text, match: false }] : parts, count: 0 };
	const re = new RegExp(result.re.source, result.re.flags.includes("g") ? result.re.flags : `${result.re.flags}g`);
	let last = 0;
	let count = 0;
	let m = re.exec(text);
	while (m) {
		if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
		if (m[0]) {
			parts.push({ text: m[0], match: true });
			count += 1;
			last = m.index + m[0].length;
		} else {
			last = m.index;
			re.lastIndex = m.index + 1;
		}
		m = re.exec(text);
	}
	if (last < text.length) parts.push({ text: text.slice(last), match: false });
	return { parts, count };
}

/** Human-readable status for the current pattern/test-string combination. */
export function matchStatus(result: RegexResult, text: string, count: number): string {
	if (result.state === "invalid") return "Check the pattern syntax";
	if (result.state === "empty") return "Add segments to build a pattern";
	if (!text) return "Enter a test string";
	return count === 0 ? "No match" : `${count} match${count === 1 ? "" : "es"}`;
}
