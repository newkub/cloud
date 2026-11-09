import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/ci/config")({
	beforeLoad: () => {
		throw redirect({ to: "/ci/settings" });
	},
});
