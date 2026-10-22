/**
 * InstallCommand — package install snippet with package-manager tabs and copy.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CopyButton } from "./CopyButton";

export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export interface InstallCommandProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Package spec, e.g. `@wrikka/solid-ui` */
	package: string;
	/** Install as a dev dependency @default false */
	dev?: boolean;
	/** Managers offered in the tab bar @default all four */
	managers?: PackageManager[];
	/** Initially selected manager @default "bun" */
	defaultManager?: PackageManager;
	/** Command verb override, e.g. "add" vs "x" @default auto */
	command?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const build = (pm: PackageManager, pkg: string, dev: boolean, command?: string) => {
	const flag = dev ? (pm === "npm" ? " -D" : " -D") : "";
	switch (pm) {
		case "bun":
			return `bun ${command ?? "add"} ${pkg}${flag}`;
		case "npm":
			return `npm ${command ?? "install"} ${pkg}${flag}`;
		case "pnpm":
			return `pnpm ${command ?? "add"} ${pkg}${flag}`;
		case "yarn":
			return `yarn ${command ?? "add"} ${pkg}${flag}`;
	}
};

export function InstallCommand(props: InstallCommandProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"package",
		"dev",
		"managers",
		"defaultManager",
		"command",
		"radius",
		"elevation",
	]);
	const managers = () => local.managers ?? ["bun", "npm", "pnpm", "yarn"];
	const [pm, setPm] = createSignal<PackageManager>(local.defaultManager ?? managers()[0] ?? "bun");
	const cmd = () => build(pm(), local.package, local.dev ?? false, local.command);
	return (
		<div
			class={`solidui-install-command overflow-hidden border border-border bg-muted/40 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={managers().length > 1}>
				<div class="flex overflow-x-auto border-b border-border">
					<For each={managers()}>
						{(m) => (
							<button
								type="button"
								aria-pressed={pm() === m}
								class={`px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${pm() === m ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
								onClick={() => setPm(m)}
							>
								{m}
							</button>
						)}
					</For>
				</div>
			</Show>
			<div class="flex items-center justify-between gap-2 px-3 py-2">
				<code class="min-w-0 flex-1 truncate font-mono text-xs text-foreground">$ {cmd()}</code>
				<CopyButton value={cmd()} iconOnly class="shrink-0 border-0 bg-transparent" />
			</div>
		</div>
	);
}
