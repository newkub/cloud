/**
 * PermissionMatrix - role × permission checkbox grid for admin settings.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface PermissionMatrixProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Column roles, e.g. ["Admin", "Editor", "Viewer"]. */
	roles: string[];
	/** Row permissions, e.g. ["Read", "Write", "Delete"]. */
	permissions: string[];
	/** Granted cells as "perm:role" pairs. */
	value: string[];
	/** Called with the next granted set. */
	onChange?: (granted: string[]) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function PermissionMatrix(props: PermissionMatrixProps) {
	const [local, rest] = splitProps(props, ["class", "roles", "permissions", "value", "onChange", "radius"]);

	const key = (perm: string, role: string) => `${perm}:${role}`;
	const granted = () => new Set(local.value);

	const toggle = (perm: string, role: string) => {
		const next = new Set(granted());
		const k = key(perm, role);
		if (next.has(k)) next.delete(k);
		else next.add(k);
		local.onChange?.([...next]);
	};

	const className = () =>
		[
			"solidui-permission-matrix overflow-x-auto border border-border",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/50">
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Permission</th>
						<For each={local.roles}>
							{(r) => <th class="px-3 py-2 text-center font-medium text-muted-foreground">{r}</th>}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={local.permissions}>
						{(p) => (
							<tr class="border-b border-border last:border-0">
								<td class="px-3 py-2 text-foreground">{p}</td>
								<For each={local.roles}>
									{(r) => (
										<td class="px-3 py-2 text-center">
											<input
												type="checkbox"
												class="h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												checked={granted().has(key(p, r))}
												aria-label={`${p} — ${r}`}
												onChange={() => toggle(p, r)}
											/>
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
