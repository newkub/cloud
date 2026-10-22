/**
 * FontPairingPicker - list of heading/body font pairings rendered in their own fonts.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface FontPair {
	/** Display name, e.g. "Editorial". */
	name: string;
	/** CSS font-family stack for headings. */
	heading: string;
	/** CSS font-family stack for body text. */
	body: string;
}

export const DEFAULT_FONT_PAIRS: FontPair[] = [
	{ name: "Classic", heading: "Georgia, serif", body: "Verdana, sans-serif" },
	{ name: "Modern", heading: "'Helvetica Neue', Arial, sans-serif", body: "Georgia, serif" },
	{ name: "Technical", heading: "'Courier New', monospace", body: "Arial, sans-serif" },
	{ name: "Elegant", heading: "'Palatino Linotype', 'Book Antiqua', serif", body: "'Lucida Grande', sans-serif" },
	{ name: "System", heading: "system-ui, sans-serif", body: "system-ui, sans-serif" },
];

export interface FontPairingPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Pairs to show. @default DEFAULT_FONT_PAIRS */
	pairs?: FontPair[];
	/** Selected pair name. */
	value?: string;
	onChange?: (pair: FontPair) => void;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function FontPairingPicker(props: FontPairingPickerProps) {
	const [local, others] = splitProps(props, ["pairs", "value", "onChange"]);
	const { className, rest } = useComponentClasses(others, {
		base: "solidui-font-pairing-picker flex flex-col divide-y divide-border overflow-hidden border",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [{ prop: "radius", map: radiusMap, default: "lg" }],
	});
	const pairs = () => local.pairs ?? DEFAULT_FONT_PAIRS;

	return (
		<div class={className()} role="listbox" aria-label="Font pairings" {...rest}>
			<For each={pairs()}>
				{(pair) => (
					<button
						type="button"
						role="option"
						aria-selected={local.value === pair.name}
						class={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
							local.value === pair.name ? "bg-primary/10" : "hover:bg-muted/50"
						}`}
						onClick={() => local.onChange?.(pair)}
					>
						<span class="flex items-baseline justify-between gap-2">
							<span class="text-base leading-tight text-foreground" style={{ "font-family": pair.heading }}>
								Heading Aa
							</span>
							<Show when={local.value === pair.name}>
								<span class="text-2xs font-medium uppercase tracking-wide text-primary">Selected</span>
							</Show>
						</span>
						<span class="text-sm text-muted-foreground" style={{ "font-family": pair.body }}>
							The quick brown fox jumps over the lazy dog.
						</span>
						<span class="mt-0.5 text-2xs text-muted-foreground">
							{pair.name} · {pair.heading.split(",")[0].replace(/'/g, "")} / {pair.body.split(",")[0].replace(/'/g, "")}
						</span>
					</button>
				)}
			</For>
		</div>
	);
}
