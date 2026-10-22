/**
 * UploadList — file rows with name, size, progress bar and cancel/retry actions by status.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type UploadStatus = "queued" | "uploading" | "done" | "error" | "canceled";

export interface UploadFile {
	/** File name. */
	name: string;
	/** File size in bytes. */
	size: number;
	/** Upload progress 0–100. @default 0 */
	progress?: number;
	/** Upload state. @default "queued" */
	status?: UploadStatus;
}

export interface UploadListProps extends Omit<JSX.HTMLAttributes<HTMLUListElement>, "onCancel"> {
	/** Files to display. */
	files: UploadFile[];
	/** Called with the file index when its cancel button is clicked. */
	onCancel?: (index: number) => void;
	/** Called with the file index when its retry button is clicked. */
	onRetry?: (index: number) => void;
	/** Corner radius of the bars. */
	radius?: Radius;
}

const statusLabel: Record<UploadStatus, string> = {
	queued: "Queued",
	uploading: "Uploading…",
	done: "Done",
	error: "Failed",
	canceled: "Canceled",
};

const statusColor: Record<UploadStatus, string> = {
	queued: "text-muted-foreground",
	uploading: "text-primary",
	done: "text-success",
	error: "text-destructive",
	canceled: "text-muted-foreground",
};

const barFill: Record<UploadStatus, string> = {
	queued: "bg-muted-foreground",
	uploading: "bg-primary",
	done: "bg-success",
	error: "bg-destructive",
	canceled: "bg-muted-foreground",
};

const formatSize = (bytes: number) => {
	if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${bytes} B`;
};

const actionClass =
	"inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-2xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none text-muted-foreground hover:text-foreground";

export function UploadList(props: UploadListProps) {
	const [local, rest] = splitProps(props, ["class", "files", "onCancel", "onRetry", "radius"]);
	const pct = (file: UploadFile) => Math.min(100, Math.max(0, file.progress ?? 0));
	const cancellable = (status: UploadStatus) => status === "queued" || status === "uploading";
	const retryable = (status: UploadStatus) => status === "error" || status === "canceled";
	return (
		<ul class={`solidui-upload-list flex flex-col gap-3 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.files}>
				{(file, index) => {
					const status = () => file.status ?? "queued";
					return (
						<li class="flex flex-col gap-1">
							<div class="flex items-baseline gap-2 text-xs">
								<span class="min-w-0 flex-1 truncate font-medium text-foreground">{file.name}</span>
								<span class="shrink-0 tabular-nums text-muted-foreground">{formatSize(file.size)}</span>
								<span class={`shrink-0 ${statusColor[status()]}`}>{statusLabel[status()]}</span>
								<Show when={local.onCancel && cancellable(status())}>
									<button
										type="button"
										class={actionClass}
										aria-label={`Cancel ${file.name}`}
										onClick={() => local.onCancel?.(index())}
									>
										Cancel
									</button>
								</Show>
								<Show when={local.onRetry && retryable(status())}>
									<button
										type="button"
										class={actionClass}
										aria-label={`Retry ${file.name}`}
										onClick={() => local.onRetry?.(index())}
									>
										Retry
									</button>
								</Show>
							</div>
							<div
								role="progressbar"
								aria-label={file.name}
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={pct(file)}
								class={`h-1.5 w-full overflow-hidden bg-muted ${radiusMap[local.radius ?? "full"]}`}
							>
								<div
									class={`h-full transition-[width] duration-500 motion-reduce:transition-none ${barFill[status()]}`}
									style={{ width: `${pct(file)}%` }}
								/>
							</div>
						</li>
					);
				}}
			</For>
		</ul>
	);
}
