import { createFileRoute } from "@tanstack/solid-router";
import { CloudFrame } from "../shell/CloudFrame";
import { LogsView } from "../shell/LogsView";

export const Route = createFileRoute("/logs")({ component: LogsPage });

function LogsPage() {
	return (
		<CloudFrame>
			<LogsView
				mode="platform"
				title="Platform logs"
				description="Pipeline runs, heal attempts and worker warnings across the workspace."
			/>
		</CloudFrame>
	);
}
