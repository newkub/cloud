/**
 * Scope Helper - Responsive animations with media queries
 */

/**
 * Scope options interface
 */
export interface ScopeOptions {
	/** Root element for scope (defaults to document.documentElement) */
	root?: Element;
	/** Media query configurations with animation settings */
	mediaQueries?: Record<string, AnimationConfig>;
}

/**
 * Animation configuration for media queries
 */
export interface AnimationConfig {
	/** Animation duration in milliseconds */
	duration?: number;
	/** Animation delay in milliseconds */
	delay?: number;
	/** Easing function name */
	easing?: string;
}

/**
 * Create a scope for responsive animations
 * @param options - Scope configuration options
 * @returns Scope instance with methods for responsive animations
 * @example
 * const scope = createScope({
 *   mediaQueries: {
 *     '(min-width: 768px)': { duration: 800, easing: 'easeOutQuad' }
 *   }
 * })
 */
export function createScope(options: ScopeOptions = {}) {
	const root = options.root || document.documentElement;
	const mediaQueries = options.mediaQueries || {};
	const listeners: Array<() => void> = [];

	/**
	 * Register a method to be scoped
	 */
	function registerMethod<T extends (...args: unknown[]) => unknown>(_name: string, method: T): T {
		return ((...args: unknown[]) => {
			// Check active media query
			const activeQuery = Object.entries(mediaQueries).find(([query]) => window.matchMedia(query).matches);

			if (activeQuery) {
				const config = activeQuery[1];
				// Apply scoped configuration
				return method(...args, config);
			}

			return method(...args);
		}) as T;
	}

	/**
	 * Listen to media query changes
	 * @param query - Media query string to listen to
	 * @param callback - Callback function called when media query matches/unmatches
	 * @returns Cleanup function to remove the listener
	 * @example
	 * scope.onMediaQueryChange('(min-width: 768px)', (matches) => {
	 *   console.log('Tablet mode:', matches)
	 * })
	 */
	function onMediaQueryChange(query: string, callback: (matches: boolean) => void): () => void {
		const mediaQuery = window.matchMedia(query);

		const handleChange = (e: MediaQueryListEvent) => {
			callback(e.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		listeners.push(() => mediaQuery.removeEventListener("change", handleChange));

		// Initial call
		callback(mediaQuery.matches);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}

	/**
	 * Get active media query configuration
	 * @returns Active animation configuration or null if no media query matches
	 * @example
	 * const config = scope.getActiveConfig()
	 * if (config) {
	 *   console.log('Current duration:', config.duration)
	 * }
	 */
	function getActiveConfig(): AnimationConfig | null {
		for (const [query, config] of Object.entries(mediaQueries)) {
			if (window.matchMedia(query).matches) {
				return config;
			}
		}
		return null;
	}

	/**
	 * Cleanup all listeners
	 * @example
	 * scope.destroy()
	 */
	function destroy(): void {
		for (const cleanup of listeners) {
			cleanup();
		}
		listeners.length = 0;
	}

	return {
		root,
		registerMethod,
		onMediaQueryChange,
		getActiveConfig,
		destroy,
	};
}

/**
 * Create a scope with default media queries
 */
export function createDefaultScope(): ReturnType<typeof createScope> {
	return createScope({
		mediaQueries: {
			"(min-width: 768px)": {
				duration: 800,
				easing: "easeOutQuad",
			},
			"(min-width: 1024px)": {
				duration: 1000,
				easing: "easeInOutQuad",
			},
		},
	});
}
