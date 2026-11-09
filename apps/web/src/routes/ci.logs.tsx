import { createFileRoute } from "@tanstack/solid-router";
import { LogsView } from "../shell/LogsView";

export const Route = createFileRoute("/ci/logs")({ component: CiLogs });

function CiLogs() {
	return (
		<LogsView
			mode="ci"
			title="CI logs"
			description="Pipeline runs, failures and heal attempts reported by the CI worker."
		/>
	);
}
