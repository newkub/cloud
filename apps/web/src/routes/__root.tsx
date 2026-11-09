import {
	createRootRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/solid-router";
import { createEffect, createSignal } from "solid-js";
import { NotFound } from "../components/NotFound";
import { Sidebar } from "../components/Sidebar";
import {
	GlobalCommandPalette,
	openCommandPalette,
} from "../shell/CommandPalette";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	const [mobileOpen, setMobileOpen] = createSignal(false);
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	let mainRef: HTMLElement | undefined;

	createEffect(() => {
		pathname();
		mainRef?.scrollTo({ top: 0 });
	});

	return (
		<div class="flex h-screen overflow-hidden bg-ink font-sans text-fg antialiased">
			<Sidebar mobileOpen={mobileOpen()} onClose={() => setMobileOpen(false)} />
			<div class="flex min-w-0 flex-1 flex-col">
				<header class="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-edge bg-ink/80 px-4 backdrop-blur lg:hidden">
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						aria-label="Open navigation"
						class="flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-panel text-dim hover:text-fg"
					>
						<span class="i-mdi:menu text-lg" />
					</button>
					<Link to="/" class="flex items-center gap-2 text-sm font-semibold">
						<span class="i-mdi:cloud-outline text-xl text-acc" />
						Wrikka Cloud
					</Link>
					<button
						type="button"
						onClick={openCommandPalette}
						aria-label="Open command palette"
						class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-panel text-dim hover:text-fg"
					>
						<span class="i-mdi:command text-lg" />
					</button>
					<Link
						to="/settings"
						aria-label="Cloud settings"
						class="flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-panel text-dim hover:text-fg"
					>
						<span class="i-mdi:cog-outline text-lg" />
					</Link>
				</header>
				<main ref={mainRef} class="min-w-0 flex-1 overflow-y-auto">
					<div class="animate-page-in h-full">
						<Outlet />
					</div>
				</main>
			</div>
			<GlobalCommandPalette />
		</div>
	);
}
