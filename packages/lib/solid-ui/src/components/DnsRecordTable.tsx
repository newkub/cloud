/**
 * DnsRecordTable - DNS record table: type chips, monospace name/value columns, TTL and optional copy.
 */
import { useCopyToClipboard } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface DnsRecord {
	/** Record type, e.g. "A", "CNAME", "TXT". */
	type: string;
	/** Record name/host, e.g. "@", "www". */
	name: string;
	/** Record value/target. */
	value: string;
	/** TTL in seconds — rendered as "auto" when omitted. */
	ttl?: number | string;
}

export interface DnsRecordTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Records to render. */
	records: DnsRecord[];
	/** Show a copy button per row for the record value. @default false */
	copyable?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

function CopyCell(props: { value: string; label: string }) {
	const { copy, copied } = useCopyToClipboard(1500);
	return (
		<button
			type="button"
			class="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			aria-label={copied() ? "Copied" : props.label}
			onClick={() => void copy(props.value)}
		>
			<Show when={copied()} fallback={<NamedIcon name="copy" class="h-3.5 w-3.5" />}>
				<NamedIcon name="check" class="h-3.5 w-3.5 text-success" />
			</Show>
		</button>
	);
}

export function DnsRecordTable(props: DnsRecordTableProps) {
	const [local, rest] = splitProps(props, ["class", "records", "copyable", "radius", "unstyled"]);

	const records = () => local.records ?? [];

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: `solidui-dns-record-table overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim();

	return (
		<div class={className()} {...rest}>
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-b border-border text-left text-2xs uppercase tracking-wide text-muted-foreground">
						<th scope="col" class="px-3 py-2 font-medium">
							Type
						</th>
						<th scope="col" class="px-3 py-2 font-medium">
							Name
						</th>
						<th scope="col" class="px-3 py-2 font-medium">
							Value
						</th>
						<th scope="col" class="px-3 py-2 text-right font-medium">
							TTL
						</th>
						{local.copyable ? <th scope="col" class="w-10 px-3 py-2" /> : null}
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					<For each={records()}>
						{(record) => (
							<tr class="transition-colors hover:bg-accent/30">
								<td class="px-3 py-2">
									<span class="inline-flex items-center rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase text-primary">
										{record.type}
									</span>
								</td>
								<td class="max-w-0 truncate px-3 py-2 font-mono text-xs text-foreground">{record.name}</td>
								<td class="max-w-0 truncate px-3 py-2 font-mono text-xs text-muted-foreground">{record.value}</td>
								<td class="px-3 py-2 text-right text-xs tabular-nums text-muted-foreground">{record.ttl ?? "auto"}</td>
								{local.copyable ? (
									<td class="px-3 py-2 text-right">
										<CopyCell value={record.value} label={`Copy ${record.name} value`} />
									</td>
								) : null}
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
