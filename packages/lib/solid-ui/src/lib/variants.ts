/**
 * Canonical variant + size maps shared across components.
 * All classes use theme tokens — never hardcoded colors.
 */

/** Status/feedback surfaces — alerts, banners, callouts, badges, toasts. */
export const statusVariants = {
	default: "border-border bg-surface text-foreground",
	primary: "border-primary/30 bg-primary/10 text-primary",
	success: "border-success/30 bg-success/10 text-success",
	warning: "border-warning/30 bg-warning/10 text-warning",
	destructive: "border-destructive/30 bg-destructive/10 text-destructive",
	info: "border-info/30 bg-info/10 text-info",
} as const;

/** Chip/badge fill styles — subtle tinted backgrounds, readable on surface. */
export const chipVariants = {
	default: "border-border bg-muted text-muted-foreground",
	primary: "border-primary/30 bg-primary/10 text-primary",
	secondary: "border-secondary bg-secondary text-secondary-foreground",
	success: "border-success/30 bg-success/10 text-success",
	warning: "border-warning/30 bg-warning/10 text-warning",
	destructive: "border-destructive/30 bg-destructive/10 text-destructive",
	outline: "border-border bg-transparent text-foreground",
} as const;

/** Card/panel elevation styles. */
export const surfaceVariants = {
	default: "border-border bg-surface text-foreground shadow-sm",
	outline: "border-border bg-transparent text-foreground",
	ghost: "border-transparent bg-transparent text-foreground",
	elevated: "border-border bg-surface text-foreground shadow-lg",
	filled: "border-transparent bg-muted text-foreground",
	primary: "border-primary/30 bg-primary/5 text-foreground",
} as const;

/** Control-like components (buttons, toggles, segmented items). */
export const controlVariants = {
	default: "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
	primary: "bg-primary text-primary-foreground hover:bg-primary/90",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
	ghost: "hover:bg-accent hover:text-accent-foreground",
	outline: "border border-border bg-transparent text-foreground hover:bg-muted",
} as const;

/** Fullscreen scrim/backdrop treatments — Spotlight, Lightbox, ImageViewer. */
export const scrimVariants = {
	default: "bg-black/50",
	dim: "bg-black/80",
	dark: "bg-black/90",
	light: "bg-black/30",
	blurred: "bg-black/40 backdrop-blur-sm",
} as const;

/** Input-like fields — border/fill treatments. */
export const inputVariants = {
	default: "border-input bg-background shadow-sm",
	outline: "border-input bg-transparent",
	filled: "border-transparent bg-muted",
	ghost: "border-transparent bg-transparent hover:bg-muted/50",
} as const;

/** Horizontal+vertical padding scale mapped to component density. */
export const paddingSizes = {
	none: "p-0",
	xs: "p-2",
	sm: "p-3",
	md: "p-4",
	lg: "p-6",
	xl: "p-8",
} as const;

/** Compact control heights (buttons, inputs, chips). */
export const controlSizes = {
	sm: "h-8 px-3 text-xs",
	md: "h-9 px-4 py-2 text-sm",
	lg: "h-10 px-6 text-sm",
} as const;

/** Corner radius scale — `sm` matches the bare `rounded` utility. */
export const radiusMap = {
	none: "rounded-none",
	sm: "rounded",
	md: "rounded-md",
	lg: "rounded-lg",
	xl: "rounded-xl",
	"2xl": "rounded-2xl",
	"3xl": "rounded-3xl",
	full: "rounded-full",
} as const;

/** Box-shadow elevation scale — `md` matches the bare `shadow` utility. */
export const elevationMap = {
	none: "shadow-none",
	sm: "shadow-sm",
	md: "shadow",
	lg: "shadow-lg",
	xl: "shadow-xl",
	"2xl": "shadow-2xl",
} as const;

/** Map for `fullWidth` boolean props — key `"true"` matches `map[String(value)]` lookup. */
export const fullWidthMap = {
	true: "w-full",
} as const;

/** Text scale for inline/typographic components (CountUp, DateText, TypewriterText, ...). */
export const textSizes = {
	xs: "text-xs",
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
} as const;

/** Foreground tone for text components. */
export const textVariants = {
	default: "text-foreground",
	muted: "text-muted-foreground",
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
} as const;

/** Accent fill for thin bars/indicators (LoadingBar, ...). */
export const barVariants = {
	default: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	info: "bg-info",
} as const;

export type ScrimVariant = keyof typeof scrimVariants;
export type InputVariant = keyof typeof inputVariants;
export type StatusVariant = keyof typeof statusVariants;
export type ChipVariant = keyof typeof chipVariants;
export type SurfaceVariant = keyof typeof surfaceVariants;
export type ControlVariant = keyof typeof controlVariants;
export type PaddingSize = keyof typeof paddingSizes;
export type ControlSize = keyof typeof controlSizes;
export type Radius = keyof typeof radiusMap;
export type Elevation = keyof typeof elevationMap;
export type TextSize = keyof typeof textSizes;
export type TextVariant = keyof typeof textVariants;
export type BarVariant = keyof typeof barVariants;
