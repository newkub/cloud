// Event handler adapter - functional implementation
import type { IChartEventHandler } from "../../modules/chart/ports/index";

// Event handler factory
export const createEventHandler = (): IChartEventHandler => {
	const listeners = new Map<string, Set<(data: unknown) => void>>();

	return {
		on: (event: string, handler: (data: unknown) => void): void => {
			if (!listeners.has(event)) {
				listeners.set(event, new Set());
			}
			listeners.get(event)?.add(handler);
		},

		off: (event: string, handler: (data: unknown) => void): void => {
			const eventListeners = listeners.get(event);
			if (eventListeners) {
				eventListeners.delete(handler);
				if (eventListeners.size === 0) {
					listeners.delete(event);
				}
			}
		},

		emit: (event: string, data: unknown): void => {
			const eventListeners = listeners.get(event);
			if (eventListeners) {
				eventListeners.forEach((handler) => {
					try {
						handler(data);
					} catch (_error) {
						// Event handler error - continue with other handlers
					}
				});
			}
		},
	};
};

// Event handler with logging
export const createLoggedEventHandler = (logger?: {
	info: (message: string, data?: unknown) => void;
}): IChartEventHandler => {
	const baseHandler = createEventHandler();

	return {
		on: (event: string, handler: (data: unknown) => void): void => {
			logger?.info(`Event handler registered for: ${event}`);
			baseHandler.on(event, handler);
		},

		off: (event: string, handler: (data: unknown) => void): void => {
			logger?.info(`Event handler removed for: ${event}`);
			baseHandler.off(event, handler);
		},

		emit: (event: string, data: unknown): void => {
			logger?.info(`Emitting event: ${event}`, data);
			baseHandler.emit(event, data);
		},
	};
};

// Event handler with event history
export const createHistoricalEventHandler = (
	maxHistory: number = 100,
): IChartEventHandler & {
	getHistory: () => readonly {
		event: string;
		data: unknown;
		timestamp: number;
	}[];
} => {
	const baseHandler = createEventHandler();
	const history: Array<{ event: string; data: unknown; timestamp: number }> = [];

	const addToHistory = (event: string, data: unknown, now: number = Date.now()): void => {
		history.push({
			event,
			data,
			timestamp: now,
		});

		// Keep only the last maxHistory events
		if (history.length > maxHistory) {
			history.splice(0, history.length - maxHistory);
		}
	};

	return {
		on: baseHandler.on,
		off: baseHandler.off,
		emit: (event: string, data: unknown): void => {
			addToHistory(event, data);
			baseHandler.emit(event, data);
		},
		getHistory: () => [...history],
	};
};
