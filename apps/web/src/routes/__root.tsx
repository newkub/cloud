import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { NotFound } from "../components/NotFound";
import { Sidebar } from "../components/Sidebar";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<div class="flex min-h-screen bg-ink font-sans text-fg antialiased">
			<Sidebar />
			<main class="min-w-0 flex-1">
				<div class="animate-page-in h-full">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
