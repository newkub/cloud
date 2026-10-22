export function buildKeyboardShortcut(event: KeyboardEvent): string {
	const modifiers: string[] = [];
	if (event.ctrlKey) modifiers.push("ctrl");
	if (event.altKey) modifiers.push("alt");
	if (event.shiftKey) modifiers.push("shift");
	if (event.metaKey) modifiers.push("meta");
	return [...modifiers, event.key].join("+");
}
