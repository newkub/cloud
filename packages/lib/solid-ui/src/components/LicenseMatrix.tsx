/**
 * LicenseMatrix - dependency/license table with policy highlighting and a compliance summary.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { chipVariants, type Radius, radiusMap } from "../lib/variants";

export interface LicenseDep {
	/** Package name. */
	name: string;
	/** SPDX license id, e.g. "MIT". */
	license: string;
}

export interface LicensePolicy {
	/** License ids permitted by policy. */
	allowed: string[];
}

export interface LicenseMatrixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Dependencies to check. */
	deps: LicenseDep[];
	/** Allow-list policy — deps whose license is not listed are flagged. */
	policy?: LicensePolicy;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function LicenseMatrix(props: LicenseMatrixProps) {
	const [local, rest] = splitProps(props, ["class", "deps", "policy", "radius", "unstyled"]);

	const deps = () => local.deps ?? [];
	const isAllowed = (dep: LicenseDep) => local.policy?.allowed.includes(dep.license) ?? null;
	const flagged = () => deps().filter((d) => isAllowed(d) === false).length;

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: `solidui-license-matrix overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim();

	return (
		<div class={className()} {...rest}>
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-b border-border text-left text-2xs uppercase tracking-wide text-muted-foreground">
						<th scope="col" class="px-3 py-2 font-medium">
							Package
						</th>
						<th scope="col" class="px-3 py-2 font-medium">
							License
						</th>
						<th scope="col" class="px-3 py-2 text-right font-medium">
							Status
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					<For each={deps()}>
						{(dep) => {
							const allowed = () => isAllowed(dep);
							return (
								<tr class={`transition-colors hover:bg-accent/30 ${allowed() === false ? "bg-destructive/5" : ""}`}>
									<td class="max-w-0 truncate px-3 py-2 font-mono text-xs text-foreground">{dep.name}</td>
									<td class="px-3 py-2">
										<span class="rounded bg-muted px-1.5 py-0.5 font-mono text-2xs text-muted-foreground">
											{dep.license}
										</span>
									</td>
									<td class="px-3 py-2 text-right">
										<Show
											when={allowed() !== null}
											fallback={
												<span
													class={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-medium ${chipVariants.default}`}
												>
													unreviewed
												</span>
											}
										>
											<span
												class={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-medium ${allowed() ? chipVariants.success : chipVariants.destructive}`}
											>
												{allowed() ? "allowed" : "flagged"}
											</span>
										</Show>
									</td>
								</tr>
							);
						}}
					</For>
				</tbody>
			</table>
			<div class="flex items-center justify-between border-t border-border px-3 py-2 text-2xs text-muted-foreground">
				<span>
					{deps().length} {deps().length === 1 ? "dependency" : "dependencies"}
				</span>
				<Show when={local.policy}>
					<span class="tabular-nums">
						<span class="text-success">{deps().length - flagged()} allowed</span>
						{" · "}
						<span class={flagged() > 0 ? "text-destructive" : ""}>{flagged()} flagged</span>
					</span>
				</Show>
			</div>
		</div>
	);
}
