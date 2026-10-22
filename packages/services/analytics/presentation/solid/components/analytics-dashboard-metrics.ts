// Analytics metrics calculations

import type {
	Event,
	Session,
	WebVital,
} from "#analytics/modules/analytics/types";

export const calculateTotalEvents = (events?: readonly Event[]): number => {
	return events?.length || 0;
};

export const calculateTotalSessions = (
	sessions?: readonly Session[],
): number => {
	return sessions?.length || 0;
};

export const calculateAverageSessionDuration = (
	sessions?: readonly Session[],
): number => {
	if (!sessions || sessions.length === 0) return 0;
	const total = sessions.reduce(
		(sum, session) => sum + (session.duration || 0),
		0,
	);
	return Math.round(total / sessions.length);
};

export const calculateWebVitalsScore = (
	webVitals?: readonly WebVital[],
): number => {
	if (!webVitals || webVitals.length === 0) return 0;
	const goodCount = webVitals.filter((v) => v.rating === "good").length;
	return Math.round((goodCount / webVitals.length) * 100);
};
