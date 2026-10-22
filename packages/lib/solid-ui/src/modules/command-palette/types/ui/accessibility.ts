/**
 * Accessibility Types - Domain types for screen reader support
 */

// ARIA roles and attributes
export interface AriaAttributes {
	readonly role?: string;
	readonly label?: string;
	readonly describedBy?: string;
	readonly labelledBy?: string;
	readonly live?: "off" | "polite" | "assertive";
	readonly atomic?: boolean;
	readonly relevant?: "additions" | "removals" | "text" | "all";
	readonly busy?: boolean;
	readonly controls?: string;
	readonly expanded?: boolean;
	readonly hasPopup?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";
	readonly level?: number;
	readonly orientation?: "horizontal" | "vertical";
	readonly multiselectable?: boolean;
	readonly required?: boolean;
	readonly invalid?: boolean;
}

// Focus management types
export interface FocusState {
	readonly focusedIndex: number;
	readonly isFocused: boolean;
	readonly focusableElements: readonly string[];
}

export interface FocusStrategy {
	readonly type: "first" | "last" | "next" | "previous" | "specific";
	readonly index?: number;
}

// Keyboard navigation types
export interface KeyboardNavigation {
	readonly up: () => void;
	readonly down: () => void;
	readonly left: () => void;
	readonly right: () => void;
	readonly home: () => void;
	readonly end: () => void;
	readonly pageUp: () => void;
	readonly pageDown: () => void;
	readonly enter: () => void;
	readonly escape: () => void;
}

// Screen reader announcement types
export interface Announcement {
	readonly message: string;
	readonly priority: "polite" | "assertive";
	readonly timestamp: number;
}

export interface AnnouncementQueue {
	readonly announcements: readonly Announcement[];
	readonly maxSize: number;
}

// Accessibility state
export interface AccessibilityState {
	readonly aria: AriaAttributes;
	readonly focus: FocusState;
	readonly announcements: AnnouncementQueue;
	readonly keyboardNavigation: KeyboardNavigation;
}
