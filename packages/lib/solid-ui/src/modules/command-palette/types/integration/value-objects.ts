/**
 * Value Object Types
 */

import type { CommandHistoryEntry } from "./history";

export type CommandLabel = string & { readonly __brand: unique symbol };
export type ThemeType = "light" | "dark" | "system";
export type Theme = ThemeType & { readonly __brand: unique symbol };
export type CommandHistory = readonly CommandHistoryEntry[];
// ClipboardHistory is imported from clipboard to avoid duplicate export

export const createTheme = (value: ThemeType): Theme => value as Theme;
export const isDarkTheme = (theme: Theme): boolean => theme === "dark";
export const isSystemTheme = (theme: Theme): boolean => theme === "system";
export const themeToString = (theme: Theme): string => theme;
