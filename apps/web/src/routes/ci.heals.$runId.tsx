import { createFileRoute } from "@tanstack/solid-router";
import { HealDetail } from "../ci/pages/HealDetail";

export const Route = createFileRoute("/ci/heals/$runId")({
	component: HealDetailPage,
});

function HealDetailPage() {
	const params = Route.useParams();
	return <HealDetail runId={params().runId} />;
}
