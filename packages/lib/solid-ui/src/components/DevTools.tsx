/**
 * DevTools — lightweight inspector overlay for solid-ui apps. Toggle with
 * Alt+Shift+D (customizable via `hotkey`), then hover the page to see the
 * element's tag, box size, classes and which theme tokens it resolves.
 *
 *   <DevTools />                  // dev only — tree-shake or gate yourself
 *   <DevTools enabled open />     // force on
 */
import { createSignal, type JSX, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";

export interface DevToolsProps {
	/** Enable the overlay. @default true — gate on import.meta.env.DEV yourself. */
	enabled?: boolean;
	/** Start open. @default false */
	open?: boolean;
	/** Hotkey combo — e.g. "Alt+Shift+KeyD". @default "Alt+Shift+KeyD" */
	hotkey?: string;
}

interface Hit {
	tag: string;
	classes: string;
	width: number;
	height: number;
	x: number;
	y: number;
	text: string;
	tokens: string[];
}

/** Utility classes that map to solid-ui theme tokens (--color-*, --su-*). */
const TOKEN_CLASSES = /^(?:bg|text|border|ring|fill|stroke|from|to|via)-(\w[\w-]*)$/;

function parseHotkey(combo: string) {
	const parts = combo.split("+");
	return {
		key: parts[parts.length - 1],
		alt: parts.includes("Alt"),
		shift: parts.includes("Shift"),
		ctrl: parts.includes("Ctrl") || parts.includes("Control"),
		meta: parts.includes("Meta"),
	};
}

export function DevTools(props: DevToolsProps) {
	const enabled = () => props.enabled ?? true;
	const [open, setOpen] = createSignal(props.open ?? false);
	const [hit, setHit] = createSignal<Hit | null>(null);

	const inspect = (e: MouseEvent) => {
		const el = document.elementFromPoint(e.clientX, e.clientY);
		if (!el || el.closest("[data-solid-ui-devtools]")) return;
		const rect = el.getBoundingClientRect();
		const classes = (el.getAttribute("class") ?? "").trim();
		const tokens = classes
			.split(/\s+/)
			.map((c) => c.match(TOKEN_CLASSES)?.[1])
			.filter((t): t is string => !!t);
		setHit({
			tag: el.tagName.toLowerCase(),
			classes,
			width: Math.round(rect.width),
			height: Math.round(rect.height),
			x: Math.round(rect.x),
			y: Math.round(rect.y),
			text: (el.textContent ?? "").trim().slice(0, 60),
			tokens,
		});
	};

	const onKey = (e: KeyboardEvent) => {
		const hk = parseHotkey(props.hotkey ?? "Alt+Shift+KeyD");
		if (
			e.code === hk.key &&
			e.altKey === hk.alt &&
			e.shiftKey === hk.shift &&
			e.ctrlKey === hk.ctrl &&
			e.metaKey === hk.meta
		) {
			e.preventDefault();
			setOpen((o) => !o);
			setHit(null);
		}
		if (e.key === "Escape" && open()) setOpen(false);
	};

	onMount(() => {
		if (!enabled()) return;
		window.addEventListener("keydown", onKey);
		onCleanup(() => window.removeEventListener("keydown", onKey));
	});

	return (
		<Show when={enabled() && open()}>
			<Portal>
				<div data-solid-ui-devtools>
					<InspectLayer onMove={inspect} hit={hit} />
					<Panel hit={hit} onClose={() => setOpen(false)} hotkey={props.hotkey ?? "Alt+Shift+KeyD"} />
				</div>
			</Portal>
		</Show>
	);
}

function InspectLayer(props: { onMove: (e: MouseEvent) => void; hit: () => Hit | null }) {
	onMount(() => {
		const move = (e: MouseEvent) => props.onMove(e);
		window.addEventListener("mousemove", move, true);
		onCleanup(() => window.removeEventListener("mousemove", move, true));
	});
	const h = () => props.hit();
	return (
		<Show when={h()}>
			{(hit) => (
				<div
					aria-hidden="true"
					style={{
						position: "fixed",
						left: `${hit().x}px`,
						top: `${hit().y}px`,
						width: `${hit().width}px`,
						height: `${hit().height}px`,
						outline: "2px solid #f43f5e",
						"outline-offset": "-1px",
						"pointer-events": "none",
						"z-index": 99998,
					}}
				/>
			)}
		</Show>
	);
}

function Panel(props: { hit: () => Hit | null; onClose: () => void; hotkey: string }) {
	const style: JSX.CSSProperties = {
		position: "fixed",
		bottom: "12px",
		right: "12px",
		"z-index": 99999,
		"font-family": "ui-monospace, monospace",
		"font-size": "11px",
		background: "#18181b",
		color: "#e4e4e7",
		border: "1px solid #3f3f46",
		"border-radius": "8px",
		padding: "10px 12px",
		width: "300px",
		"max-height": "40vh",
		overflow: "auto",
		"box-shadow": "0 8px 24px rgb(0 0 0 / 0.4)",
	};
	return (
		<output style={style} aria-label="solid-ui DevTools">
			<div style={{ display: "flex", "justify-content": "space-between", "margin-bottom": "6px" }}>
				<strong>solid-ui inspector</strong>
				<button
					type="button"
					onClick={props.onClose}
					style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer" }}
					aria-label="Close DevTools"
				>
					✕
				</button>
			</div>
			<Show
				when={props.hit()}
				fallback={<p style={{ color: "#a1a1aa", margin: 0 }}>Hover an element… ({props.hotkey} toggles)</p>}
			>
				{(hit) => (
					<div style={{ display: "grid", gap: "4px" }}>
						<div>
							<span style={{ color: "#f43f5e" }}>&lt;{hit().tag}&gt;</span>{" "}
							<span style={{ color: "#a1a1aa" }}>
								{hit().width}×{hit().height}
							</span>
						</div>
						<Show when={hit().classes}>
							<div style={{ "word-break": "break-all", color: "#93c5fd" }}>{hit().classes}</div>
						</Show>
						<Show when={hit().tokens.length}>
							<div>
								tokens: <span style={{ color: "#86efac" }}>{hit().tokens.join(", ")}</span>
							</div>
						</Show>
						<Show when={hit().text}>
							<div style={{ color: "#a1a1aa" }}>“{hit().text}”</div>
						</Show>
					</div>
				)}
			</Show>
		</output>
	);
}
