/**
 * PackageManagerTabs - npm/bun/pnpm/yarn install-command tab strip for docs.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { CopyButton } from "./CopyButton";

export interface PackageManagerTabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Package name or full install arg, e.g. "@wrikka/solid-ui". */
	pkg: string;
	/** Managers to show. @default ["bun","npm","pnpm","yarn"] */
	managers?: string[];
	/** Command template; `{pkg}` is replaced. @default "{pm} add {pkg}" */
	template?: string;
	/** Corner radius. */
	radius?: Radius;
}

const PM_CMD: Record<string, string> = {
	bun: "bun add",
	npm: "npm install",
	pnpm: "pnpm add",
	yarn: "yarn add",
};

export function PackageManagerTabs(props: PackageManagerTabsProps) {
	const [local, rest] = splitProps(props, ["class", "pkg", "managers", "template", "radius"]);
	const managers = () => local.managers ?? ["bun", "npm", "pnpm", "yarn"];
	const [active, setActive] = createSignal(managers()[0]);

	const command = () =>
		(local.template ?? "{pm} {pkg}").replace("{pm}", PM_CMD[active()] ?? active()).replace("{pkg}", local.pkg);

	const className = () =>
		[
			"solidui-package-manager-tabs border border-border bg-card overflow-hidden",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex border-b border-border bg-muted/40" role="tablist">
				<For each={managers()}>
					{(m) => (
						<button
							type="button"
							role="tab"
							aria-selected={active() === m}
							class={`px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
								active() === m
									? "border-b-2 border-primary text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setActive(m)}
						>
							{m}
						</button>
					)}
				</For>
			</div>
			<div class="flex items-center gap-2 px-3 py-2">
				<code class="flex-1 font-mono text-sm text-foreground">{command()}</code>
				<CopyButton value={command()} class="h-7" />
			</div>
		</div>
	);
}
