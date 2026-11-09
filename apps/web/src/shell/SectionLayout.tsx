import { createSignal, For, type JSX, onCleanup, onMount } from "solid-js";
import { loadPrefs } from "../lib/theme";

export interface SectionLink {
	id: string;
	label: string;
}

export function SectionLayout(props: {
	sections: SectionLink[];
	label?: string;
	children: JSX.Element;
}) {
	const [active, setActive] = createSignal(props.sections[0]?.id ?? "");
	let observer: IntersectionObserver | undefined;

	onMount(() => {
		const elements = props.sections
			.map((section) => document.getElementById(section.id))
			.filter((element): element is HTMLElement => Boolean(element));
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort(
						(a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
					)[0];
				if (visible) {
					setActive(visible.target.id);
				}
			},
			{ rootMargin: "-96px 0px -55% 0px", threshold: 0 },
		);
		for (const element of elements) {
			observer.observe(element);
		}
	});

	onCleanup(() => observer?.disconnect());

	function goTo(id: string) {
		setActive(id);
		const reduced =
			loadPrefs().reducedMotion ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		document.getElementById(id)?.scrollIntoView({
			behavior: reduced ? "auto" : "smooth",
			block: "start",
		});
	}

	const label = () => props.label ?? "On this page";

	return (
		<div class="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
			<nav aria-label={label()} class="flex gap-1.5 overflow-x-auto lg:hidden">
				<For each={props.sections}>
					{(section) => (
						<a
							href={`#${section.id}`}
							aria-current={active() === section.id ? "true" : undefined}
							onClick={(event) => {
								event.preventDefault();
								goTo(section.id);
							}}
							class={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
								active() === section.id
									? "border-acc/40 bg-acc/10 text-acc"
									: "border-edge text-dim hover:text-fg"
							}`}
						>
							{section.label}
						</a>
					)}
				</For>
			</nav>

			<nav aria-label={label()} class="hidden lg:block">
				<div class="sticky top-6">
					<p class="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
						{label()}
					</p>
					<div class="space-y-0.5">
						<For each={props.sections}>
							{(section) => (
								<a
									href={`#${section.id}`}
									aria-current={active() === section.id ? "true" : undefined}
									onClick={(event) => {
										event.preventDefault();
										goTo(section.id);
									}}
									class={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
										active() === section.id
											? "bg-acc/10 font-medium text-acc"
											: "text-dim hover:bg-raise hover:text-fg"
									}`}
								>
									{section.label}
								</a>
							)}
						</For>
					</div>
				</div>
			</nav>

			<div class="min-w-0">{props.children}</div>
		</div>
	);
}
