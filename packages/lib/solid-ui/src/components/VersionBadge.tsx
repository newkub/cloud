/**
 * VersionBadge — semver pill with prerelease coloring (alpha/beta/rc → warning tones).
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface VersionBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	version: string;
	/** Prefix before the version. @default "v" */
	prefix?: string;
	/** Show build metadata (+sha). @default false */
	showBuild?: boolean;
	/** Copy on click. @default false */
	copyable?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const sizeCls = { sm: "text-2xs px-1.5 py-0", md: "text-xs px-2 py-0.5", lg: "text-sm px-2.5 py-1" } as const;

function channel(version: string): { base: string; pre?: string; build?: string } {
	const [main, build] = version.split("+");
	const [base, pre] = main.split("-", 2);
	return { base, pre, build };
}

const preCls = (pre?: string) =>
	!pre
		? ""
		: /^rc/.test(pre)
			? "bg-info/15 text-info"
			: /^(alpha|beta|next|canary|dev)/.test(pre)
				? "bg-warning/15 text-warning"
				: "bg-muted text-muted-foreground";

export function VersionBadge(props: VersionBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "version", "prefix", "showBuild", "copyable", "size", "radius"]);
	const parts = () => channel(local.version ?? "");
	const text = () =>
		`${local.prefix ?? "v"}${parts().base}${parts().pre ? `-${parts().pre}` : ""}${local.showBuild && parts().build ? `+${parts().build}` : ""}`;
	const { copy: copyText } = useCopyToClipboard();
	const copy = () => {
		if (!local.copyable) return;
		void copyText(text());
	};
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: role/tabindex applied only when copyable
		<span
			class={`solidui-version-badge inline-flex items-center gap-1 font-mono font-medium ${sizeCls[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${parts().pre ? preCls(parts().pre) : "bg-success/15 text-success"} ${local.copyable ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : ""} ${local.class ?? ""}`.trim()}
			role={local.copyable ? "button" : undefined}
			tabIndex={local.copyable ? 0 : undefined}
			onClick={copy}
			onKeyDown={(e) => {
				if (local.copyable && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					copy();
				}
			}}
			{...rest}
		>
			{local.prefix ?? "v"}
			{parts().base}
			<Show when={parts().pre}>
				<span class="opacity-80">-{parts().pre}</span>
			</Show>
			<Show when={local.showBuild && parts().build}>
				<span class="opacity-60">+{parts().build}</span>
			</Show>
		</span>
	);
}
