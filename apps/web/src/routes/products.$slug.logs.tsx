import { createFileRoute, getRouteApi } from "@tanstack/solid-router";
import { LogsView } from "../shell/LogsView";

export const Route = createFileRoute("/products/$slug/logs")({
	component: ProductLogs,
});

const parent = getRouteApi("/products/$slug");

function ProductLogs() {
	const data = parent.useLoaderData();

	return (
		<LogsView
			mode="sample"
			title={`${data().product.name} logs`}
			description="Preview feed — connect the service to stream real events."
		/>
	);
}
