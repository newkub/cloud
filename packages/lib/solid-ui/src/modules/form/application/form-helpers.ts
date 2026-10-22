import { type Accessor, createMemo } from "solid-js";
import type { FieldState, FieldValue } from "../domain/models";

export function createGetFieldState(fields: Accessor<Record<string, FieldState>>) {
	return (name: string) => {
		return createMemo(() => fields()[name]);
	};
}

export function createGetValue<T = FieldValue>(fields: Accessor<Record<string, FieldState>>) {
	return (name: string): Accessor<T | undefined> => {
		return createMemo(() => fields()[name]?.value as T | undefined);
	};
}

export function createGetError(fields: Accessor<Record<string, FieldState>>) {
	return (name: string): Accessor<string | null> => {
		return createMemo(() => fields()[name]?.error ?? null);
	};
}
