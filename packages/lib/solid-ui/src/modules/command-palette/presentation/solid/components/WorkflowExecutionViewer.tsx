/**
 * WorkflowExecutionViewer - SolidJS component for viewing workflow execution status
 */

import { createMemo, For, Show, splitProps } from "solid-js";
import type { WorkflowExecution } from "../../../types";
import { ExecutionCard } from "./workflow-execution-viewer/ExecutionCard";
import { formatDate, formatDuration, getExecutionProgress, getStatusColor } from "./workflow-execution-viewer/utils";

interface WorkflowExecutionViewerProps {
	executions: readonly WorkflowExecution[];
	onViewDetails?: (executionId: string) => void;
	onCancelExecution?: (executionId: string) => void;
	onRetryExecution?: (executionId: string) => void;
}

interface ExecutionHeaderProps {
	runningCount: number;
	completedCount: number;
	failedCount: number;
}

function ExecutionHeader(props: ExecutionHeaderProps) {
	return (
		<div class="execution-header">
			<h2 class="execution-title">Workflow Executions</h2>
			<div class="execution-stats">
				<div class="stat-item">
					<span class="stat-label">Running:</span>
					<span class="stat-value">{props.runningCount}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Completed:</span>
					<span class="stat-value">{props.completedCount}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Failed:</span>
					<span class="stat-value">{props.failedCount}</span>
				</div>
			</div>
		</div>
	);
}

interface ExecutionSectionProps {
	title: string;
	executions: readonly WorkflowExecution[];
	statusColor: string;
	onViewDetails?: (executionId: string) => void;
	onCancel?: (executionId: string) => void;
	onRetry?: (executionId: string) => void;
}

function ExecutionSection(props: ExecutionSectionProps) {
	return (
		<Show when={props.executions.length > 0}>
			<div class="execution-section">
				<h3 class="section-title">{props.title}</h3>
				<div class="execution-list">
					<For each={props.executions}>
						{(execution) => (
							<ExecutionCard
								execution={execution}
								statusColor={props.statusColor}
								formatDuration={formatDuration}
								formatDate={formatDate}
								getProgress={getExecutionProgress}
								onViewDetails={props.onViewDetails}
								onCancel={props.onCancel}
								onRetry={props.onRetry}
							/>
						)}
					</For>
				</div>
			</div>
		</Show>
	);
}

export function WorkflowExecutionViewer(props: WorkflowExecutionViewerProps) {
	const [local] = splitProps(props, ["executions", "onViewDetails", "onCancelExecution", "onRetryExecution"]);

	const runningExecutions = createMemo(() => local.executions.filter((e) => e.status === "running"));
	const completedExecutions = createMemo(() => local.executions.filter((e) => e.status === "completed"));
	const failedExecutions = createMemo(() => local.executions.filter((e) => e.status === "failed"));

	return (
		<div class="workflow-execution-viewer">
			<ExecutionHeader
				runningCount={runningExecutions().length}
				completedCount={completedExecutions().length}
				failedCount={failedExecutions().length}
			/>

			<ExecutionSection
				title="Running"
				executions={runningExecutions()}
				statusColor={getStatusColor("running")}
				onViewDetails={local.onViewDetails}
				onCancel={local.onCancelExecution}
			/>

			<ExecutionSection
				title="Failed"
				executions={failedExecutions()}
				statusColor={getStatusColor("failed")}
				onViewDetails={local.onViewDetails}
				onRetry={local.onRetryExecution}
			/>

			<ExecutionSection
				title="Completed"
				executions={completedExecutions()}
				statusColor={getStatusColor("completed")}
				onViewDetails={local.onViewDetails}
			/>

			<Show when={local.executions.length === 0}>
				<div class="empty-state">
					<p class="empty-message">No workflow executions</p>
				</div>
			</Show>
		</div>
	);
}
