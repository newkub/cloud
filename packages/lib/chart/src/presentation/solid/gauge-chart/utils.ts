// Gauge chart calculation utilities

import type { GaugeThreshold } from "../../../modules/chart/types/index";

export const calculateGaugePercentage = (value: number, min: number, max: number): number => {
	return (value - min) / (max - min);
};

export const calculateAngle = (percentage: number, startAngle: number, endAngle: number): number => {
	return startAngle + percentage * (endAngle - startAngle);
};

export const polarToCartesian = (
	centerX: number,
	centerY: number,
	radius: number,
	angleInRadians: number,
): { x: number; y: number } => {
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
};

export const getGaugeThreshold = (value: number, thresholds: readonly GaugeThreshold[]): GaugeThreshold | undefined => {
	return thresholds.find((t) => value <= t.value);
};
