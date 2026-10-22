/**
 * Local Storage implementation (Functional style)
 * Browser localStorage adapter
 */

import {
	sessionFromData,
	sessionToObject,
} from "#analytics/modules/analytics/domain/operations";
import type { Session } from "#analytics/modules/analytics/types";
import { isErr } from "#analytics/shared/utils/result";

export type LocalStorageDependencies = Readonly<{
	prefix?: string;
}>;

export const createLocalStorage = (
	dependencies: LocalStorageDependencies = {},
): LocalStorageDependencies => ({
	prefix: dependencies.prefix || "analytics_",
});

export const saveSession = async (
	dependencies: LocalStorageDependencies,
	session: Session,
): Promise<Session> => {
	const prefix = dependencies.prefix || "analytics_";
	const key = `${prefix}session_${session.id.toString()}`;
	const data = sessionToObject(session);
	localStorage.setItem(key, JSON.stringify(data));
	return session;
};

export const findSessionById = async (
	dependencies: LocalStorageDependencies,
	id: string,
): Promise<Session | null> => {
	const prefix = dependencies.prefix || "analytics_";
	const key = `${prefix}session_${id}`;
	const data = localStorage.getItem(key);
	if (!data) {
		return null;
	}

	const parsed = JSON.parse(data);
	const sessionResult = sessionFromData(parsed);
	if (isErr(sessionResult)) {
		return null;
	}
	return sessionResult.success ? sessionResult.data : null;
};

export const findSessionsByUserId = async (
	dependencies: LocalStorageDependencies,
	userId: string,
): Promise<Session[]> => {
	const prefix = dependencies.prefix || "analytics_";
	const sessions: Session[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(`${prefix}session_`)) {
			const data = localStorage.getItem(key);
			if (data) {
				const parsed = JSON.parse(data);
				if (parsed.userId === userId) {
					const sessionResult = sessionFromData(parsed);
					if (!isErr(sessionResult) && sessionResult.success) {
						sessions.push(sessionResult.data);
					}
				}
			}
		}
	}
	return sessions;
};

export const deleteSession = async (
	dependencies: LocalStorageDependencies,
	id: string,
): Promise<void> => {
	const prefix = dependencies.prefix || "analytics_";
	const key = `${prefix}session_${id}`;
	localStorage.removeItem(key);
};

export const clearSessions = async (
	dependencies: LocalStorageDependencies,
): Promise<void> => {
	const prefix = dependencies.prefix || "analytics_";
	const keys: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(`${prefix}session_`)) {
			keys.push(key);
		}
	}
	for (const key of keys) {
		localStorage.removeItem(key);
	}
};
