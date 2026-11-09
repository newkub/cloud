import { createFileRoute } from "@tanstack/solid-router";
import { ConnectionCard } from "../ci/ConnectionCard";
import { HowItWorksCard, PipelineCard, WorkerCard } from "../ci/pages/Config";
import { SectionLayout } from "../shell/SectionLayout";

export const Route = createFileRoute("/ci/settings")({ component: CiSettings });

const SECTIONS = [
	{ id: "connection", label: "Connection" },
	{ id: "pipeline", label: "Pipeline" },
	{ id: "worker", label: "Worker status" },
	{ id: "how-it-works", label: "How it works" },
];

function CiSettings() {
	return (
		<SectionLayout sections={SECTIONS} label="CI settings">
			<div class="space-y-4">
				<section id="connection" class="scroll-mt-24">
					<ConnectionCard description="Pipeline data flows through this worker. Every CI tab shares the same endpoint." />
				</section>
				<section id="pipeline" class="scroll-mt-24">
					<PipelineCard />
				</section>
				<section id="worker" class="scroll-mt-24">
					<WorkerCard />
				</section>
				<section id="how-it-works" class="scroll-mt-24">
					<HowItWorksCard />
				</section>
			</div>
		</SectionLayout>
	);
}
