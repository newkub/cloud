import { createFileRoute } from "@tanstack/solid-router";
import { RunDetail } from "../ci/pages/RunDetail";

export const Route = createFileRoute("/ci/runs/$runId")({
	component: RunDetailPage,
});

function RunDetailPage() {
	const params = Route.useParams();
	return <RunDetail runId={params().runId} />;
}
