/**
 * Chart module public API.
 *
 * Exposes chart creation, validation, events, and type definitions.
 * The Solid adapters live under `@wrikka/chart/solid`.
 */

// Application layer (internal barrel - acceptable exception)
export * from "./modules/chart/application";
export type {
	ChartResponse,
	CreateChartRequest,
	UpdateChartRequest,
} from "./modules/chart/domain";
// Domain layer (sub-entry already uses explicit exports)
export {
	createChartAnimationEvent,
	createChartClickEvent,
	createChartCreateEvent,
	createChartDataChangeEvent,
	createChartDestroyEvent,
	createChartRenderEvent,
	createChartResizeEvent,
	createChartUpdateEvent,
	isChartAnimationEvent,
	isChartClickEvent,
	isChartCreateEvent,
	isChartDataChangeEvent,
	isChartDestroyEvent,
	isChartRenderEvent,
	isChartResizeEvent,
	isChartUpdateEvent,
} from "./modules/chart/domain/events";
export * from "./modules/chart/domain/models";
export {
	addDataset,
	aggregateData,
	aggregateDatasets,
	aggregateGroupedData,
	areChartsEqual,
	calculateAngle,
	calculateCount,
	calculateDataBounds,
	calculateGaugePercentage,
	calculateMax,
	calculateMean,
	calculateMedian,
	calculateMin,
	calculatePercentage,
	calculateStandardDeviation,
	calculateSum,
	cloneChart,
	createDataset,
	easeInOutCubic,
	filterByIndex,
	filterByThreshold,
	filterDataPoints,
	findThreshold,
	groupData,
	interpolateValue,
	mergeDatasets,
	normalizeData,
	normalizeDataset,
	polarToCartesian,
	removeDataset,
	resampleData,
	roundToPrecision,
	scalePoints,
	smoothData,
	smoothStep,
	sortDataByLabel,
	sortDatasetByValue,
	transformDataset,
	transformPoints,
	translatePoints,
	updateChartData,
	updateChartOptions,
	updateChartType,
	updateDataset,
} from "./modules/chart/domain/operations";
export {
	validateChart,
	validateChartConfig,
	validateChartData,
	validateChartType,
	validateColor,
	validateCompleteChart,
	validateDataset,
	validateLabels,
	validateValueRange,
} from "./modules/chart/domain/validators";

// Ports (interface definitions)
export type {
	ChartModel,
	ChartTheme,
	IAnimationController,
	IChartEventHandler,
	IChartRenderer,
	IChartRepository,
	IConfigurationProvider,
	ILogger,
	IPerformanceMonitor,
	IThemeProvider,
	PerformanceMetric,
} from "./modules/chart/ports";
