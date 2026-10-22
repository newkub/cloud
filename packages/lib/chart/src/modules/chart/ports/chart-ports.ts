// Chart module ports (interfaces for external dependencies)
import type { ChartConfig, ChartData, ChartOptions, ChartResponse, ChartType } from "../types/index";

// Chart model interface (simplified for ports)
export interface ChartModel {
	readonly id: string;
	readonly type: ChartType;
	readonly data: ChartData;
	readonly options: ChartOptions;
	readonly metadata: {
		readonly id: string;
		readonly type: ChartType;
		readonly createdAt: number;
		readonly updatedAt: number;
	};
}

// Renderer port - defines contract for chart rendering
export interface IChartRenderer {
	render(config: ChartConfig): Promise<ChartResponse>;
	update(data: ChartData): Promise<ChartResponse>;
	destroy(): Promise<void>;
	resize(width: number, height: number): Promise<void>;
}

// Event handler port - defines contract for event management
export interface IChartEventHandler {
	on(event: string, handler: (event: unknown) => void): void;
	off(event: string, handler: (event: unknown) => void): void;
	emit(event: string, data: unknown): void;
}

// Data repository port - defines contract for data persistence
export interface IChartRepository {
	save(chart: ChartModel): Promise<ChartResponse>;
	findById(id: string): Promise<ChartModel | null>;
	findAll(): Promise<readonly ChartModel[]>;
	delete(id: string): Promise<void>;
	update(id: string, chart: Partial<ChartModel>): Promise<ChartResponse>;
}

// Animation controller port - defines contract for animations
export interface IAnimationController {
	animate(
		from: number,
		to: number,
		duration: number,
		easing: (t: number) => number,
		onUpdate: (progress: number) => void,
	): Promise<void>;
	stop(): void;
	isAnimating(): boolean;
}

// Theme provider port - defines contract for theming
export interface IThemeProvider {
	getTheme(name: string): ChartTheme;
	listThemes(): readonly string[];
	registerTheme(name: string, theme: ChartTheme): void;
}

export interface ChartTheme {
	readonly colors: readonly string[];
	readonly backgroundColor: string;
	readonly gridColor: string;
	readonly textColor: string;
	readonly fontFamily: string;
	readonly fontSize: number;
}

// Configuration provider port - defines contract for configuration
export interface IConfigurationProvider {
	get<T>(key: string): T | null;
	set<T>(key: string, value: T): void;
	getAll(): Record<string, unknown>;
}

// Logger port - defines contract for logging
export interface ILogger {
	debug(message: string, ...args: unknown[]): void;
	info(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string, error?: Error, ...args: unknown[]): void;
}

// Performance monitor port - defines contract for performance tracking
export interface IPerformanceMonitor {
	startTimer(name: string): () => void;
	measure(name: string, fn: () => void | Promise<void>): Promise<void>;
	getMetrics(): readonly PerformanceMetric[];
}

export interface PerformanceMetric {
	readonly name: string;
	readonly duration: number;
	readonly timestamp: number;
}
