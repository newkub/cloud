/**
 * Accessibility Operations - Domain operations for screen reader support
 */

import type {
	Announcement,
	AnnouncementQueue,
	AriaAttributes,
	FocusState,
	FocusStrategy,
	KeyboardNavigation,
} from "../../../types/ui/accessibility";

// Create ARIA attributes
export const createAriaAttributes = (
	role: string,
	label?: string,
	options?: Partial<AriaAttributes>,
): AriaAttributes => ({
	role,
	label,
	...options,
});

// Create focus state
export const createFocusState = (focusedIndex: number, focusableElements: readonly string[]): FocusState => ({
	focusedIndex,
	isFocused: focusedIndex >= 0,
	focusableElements,
});

// Move focus
export const moveFocus = (state: FocusState, strategy: FocusStrategy): FocusState => {
	const { focusedIndex, focusableElements } = state;
	let newIndex = focusedIndex;

	switch (strategy.type) {
		case "first":
			newIndex = 0;
			break;
		case "last":
			newIndex = focusableElements.length - 1;
			break;
		case "next":
			newIndex = Math.min(focusedIndex + 1, focusableElements.length - 1);
			break;
		case "previous":
			newIndex = Math.max(focusedIndex - 1, 0);
			break;
		case "specific":
			newIndex = strategy.index ?? 0;
			break;
	}

	return createFocusState(newIndex, focusableElements);
};

// Create announcement queue
export const createAnnouncementQueue = (maxSize: number = 10): AnnouncementQueue => ({
	announcements: [],
	maxSize,
});

// Add announcement
export const addAnnouncement = (
	queue: AnnouncementQueue,
	message: string,
	priority: "polite" | "assertive" = "polite",
): AnnouncementQueue => {
	const announcement: Announcement = {
		message,
		priority,
		timestamp: Date.now(),
	};

	const updatedAnnouncements = [announcement, ...queue.announcements].slice(0, queue.maxSize);

	return {
		...queue,
		announcements: updatedAnnouncements,
	};
};

// Clear announcements
export const clearAnnouncements = (queue: AnnouncementQueue): AnnouncementQueue => ({
	...queue,
	announcements: [],
});

// Get latest announcement
export const getLatestAnnouncement = (queue: AnnouncementQueue): Announcement | undefined => {
	return queue.announcements[0];
};

// Create keyboard navigation
export const createKeyboardNavigation = (
	onUp: () => void,
	onDown: () => void,
	onLeft: () => void,
	onRight: () => void,
	onHome: () => void,
	onEnd: () => void,
	onPageUp: () => void,
	onPageDown: () => void,
	onEnter: () => void,
	onEscape: () => void,
): KeyboardNavigation => ({
	up: onUp,
	down: onDown,
	left: onLeft,
	right: onRight,
	home: onHome,
	end: onEnd,
	pageUp: onPageUp,
	pageDown: onPageDown,
	enter: onEnter,
	escape: onEscape,
});
