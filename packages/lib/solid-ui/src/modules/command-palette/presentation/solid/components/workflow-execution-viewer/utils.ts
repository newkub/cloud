/**
 * Workflow execution viewer utility functions
 */

import type { WorkflowExecution } from "../../../../types";

export const getStatusColor = (status: WorkflowExecution["status"]): string => {
	switch (status) {
		case "pending":
			return "bg-yellow-500";
		case "running":
			return "bg-blue-500";
		case "completed":
			return "bg-green-500";
		case "failed":
			return "bg-red-500";
		case "cancelled":
			return "bg-gray-500";
		default:
			return "bg-gray-500";
	}
};

export const formatDuration = (ms: number): string => {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${(ms / 60000).toFixed(1)}m`;
};

export const formatDate = (date: Date): string => {
	return new Date(date).toLocaleString();
};

export const getExecutionProgress = (execution: WorkflowExecution): number => {
	if (execution.status === "completed" || execution.status === "failed") {
		return 100;
	}
	if (execution.status === "cancelled") {
		return 0;
	}
	return (execution.currentStepIndex / execution.results.length) * 100;
};
