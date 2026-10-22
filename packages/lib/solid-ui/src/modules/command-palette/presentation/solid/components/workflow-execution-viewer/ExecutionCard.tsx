/**
 * ExecutionCard - Individual workflow execution card component
 */

import { For, Show, splitProps } from "solid-js";
import type { WorkflowExecution } from "../../../../types";

interface ExecutionCardProps {
	execution: WorkflowExecution;
	statusColor: string;
	formatDuration: (ms: number) => string;
	formatDate: (date: Date) => string;
	getProgress: (execution: WorkflowExecution) => number;
	onViewDetails?: (executionId: string) => void;
	onCancel?: (executionId: string) => void;
	onRetry?: (executionId: string) => void;
}

interface ExecutionCardHeaderProps {
	execution: WorkflowExecution;
	statusColor: string;
	onViewDetails?: (executionId: string) => void;
	onCancel?: (executionId: string) => void;
	onRetry?: (executionId: string) => void;
}

function ExecutionCardHeader(props: ExecutionCardHeaderProps) {
	return (
		<div class="execution-card-header">
			<div class="execution-info">
				<div class={`status-indicator ${props.statusColor}`} />
				<span class="execution-id">{props.execution.id}</span>
				<span class="execution-status">{props.execution.status}</span>
			</div>
			<div class="execution-actions">
				<button class="action-button view" onClick={() => props.onViewDetails?.(props.execution.id)} type="button">
					View Details
				</button>
				<Show when={props.execution.status === "running"}>
					<button class="action-button cancel" onClick={() => props.onCancel?.(props.execution.id)} type="button">
						Cancel
					</button>
				</Show>
				<Show when={props.execution.status === "failed"}>
					<button class="action-button retry" onClick={() => props.onRetry?.(props.execution.id)} type="button">
						Retry
					</button>
				</Show>
			</div>
		</div>
	);
}

interface ExecutionCardProgressProps {
	execution: WorkflowExecution;
	getProgress: (execution: WorkflowExecution) => number;
}

function ExecutionCardProgress(props: ExecutionCardProgressProps) {
	const progress = () => props.getProgress(props.execution);

	return (
		<div class="execution-progress">
			<div class="progress-bar">
				<div class="progress-fill" style={{ width: `${progress()}%` }} />
			</div>
			<span class="progress-text">
				Step {props.execution.currentStepIndex + 1} / {props.execution.results.length}
			</span>
		</div>
	);
}

interface ExecutionCardMetaProps {
	execution: WorkflowExecution;
	formatDuration: (ms: number) => string;
	formatDate: (date: Date) => string;
}

function ExecutionCardMeta(props: ExecutionCardMetaProps) {
	const executionDuration = () => {
		if (props.execution.completedAt) {
			return props.execution.completedAt.getTime() - props.execution.startedAt.getTime();
		}
		return Date.now() - props.execution.startedAt.getTime();
	};

	return (
		<div class="execution-meta">
			<span class="meta-item">Started: {props.formatDate(props.execution.startedAt)}</span>
			<span class="meta-item">Duration: {props.formatDuration(executionDuration())}</span>
		</div>
	);
}

interface ExecutionCardErrorProps {
	error?: string;
}

function ExecutionCardError(props: ExecutionCardErrorProps) {
	return (
		<div class="execution-error">
			<span class="error-label">Error:</span>
			<span class="error-message">{props.error}</span>
		</div>
	);
}

interface ExecutionCardStepsSummaryProps {
	execution: WorkflowExecution;
	formatDuration: (ms: number) => string;
}

function ExecutionCardStepsSummary(props: ExecutionCardStepsSummaryProps) {
	return (
		<div class="execution-steps-summary">
			<For each={props.execution.results}>
				{(result, index) => (
					<div class={`step-result ${result.success ? "success" : "failed"}`}>
						<span class="step-number">Step {index() + 1}</span>
						<span class="step-status">{result.success ? "✓" : "✗"}</span>
						<span class="step-duration">{props.formatDuration(result.executionTime)}</span>
					</div>
				)}
			</For>
		</div>
	);
}

export function ExecutionCard(props: ExecutionCardProps) {
	const [local] = splitProps(props, [
		"execution",
		"statusColor",
		"formatDuration",
		"formatDate",
		"getProgress",
		"onViewDetails",
		"onCancel",
		"onRetry",
	]);

	return (
		<div class="execution-card">
			<ExecutionCardHeader
				execution={local.execution}
				statusColor={local.statusColor}
				onViewDetails={local.onViewDetails}
				onCancel={local.onCancel}
				onRetry={local.onRetry}
			/>

			<ExecutionCardProgress execution={local.execution} getProgress={local.getProgress} />

			<ExecutionCardMeta
				execution={local.execution}
				formatDuration={local.formatDuration}
				formatDate={local.formatDate}
			/>

			<Show when={local.execution.error}>
				<ExecutionCardError error={local.execution.error} />
			</Show>

			<ExecutionCardStepsSummary execution={local.execution} formatDuration={local.formatDuration} />
		</div>
	);
}
