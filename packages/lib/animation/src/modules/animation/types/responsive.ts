/**
 * Responsive Animations Types
 */

export interface ResponsiveOptions {
	breakpoints?: {
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};
	properties?: Record<string, Record<string, Record<string, number>>>;
	listener?: boolean;
}
