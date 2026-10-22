/**
 * SecretInput — masked field for tokens/keys with reveal toggle, strength
 * meter and copy button. Companion to PasswordInput (form-oriented).
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SecretInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onInput" | "onChange"> {
	/** Controlled value. */
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	onInput?: (value: string) => void;
	/** Show the reveal eye toggle. @default true */
	revealable?: boolean;
	/** Show the strength meter. @default true */
	showStrength?: boolean;
	/** Show the copy button. @default true */
	showCopy?: boolean;
	placeholder?: string;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
}

let secretInputId = 0;

const STRENGTH = [
	{ label: "Weak", cls: "bg-destructive", text: "text-destructive" },
	{ label: "Fair", cls: "bg-warning", text: "text-warning" },
	{ label: "Good", cls: "bg-info", text: "text-info" },
	{ label: "Strong", cls: "bg-success", text: "text-success" },
] as const;

const iconBtn =
	"rounded px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function SecretInput(props: SecretInputProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"value",
		"defaultValue",
		"onInput",
		"revealable",
		"showStrength",
		"showCopy",
		"placeholder",
		"disabled",
		"radius",
		"fullWidth",
	]);
	const autoId = `solidui-secret-${++secretInputId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [revealed, setRevealed] = createSignal(false);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const value = () => (local.value !== undefined ? local.value : internal());

	const score = () => {
		const v = value();
		if (!v) return 0;
		let s = 0;
		if (v.length >= 8) s++;
		if (v.length >= 14) s++;
		if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
		if (/\d/.test(v) || /[^a-zA-Z0-9]/.test(v)) s++;
		return Math.min(s, 4);
	};
	const strength = () => STRENGTH[Math.max(score() - 1, 0)];

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		setInternal(e.currentTarget.value);
		local.onInput?.(e.currentTarget.value);
	};

	const copy = () => void copyText(value());

	return (
		<div class={`${(local.fullWidth ?? true) ? "w-full" : "inline-block"} ${local.class ?? ""}`.trim()} {...rest}>
			<div class="relative">
				<input
					id={id()}
					type={revealed() ? "text" : "password"}
					class={`w-full border border-border bg-background py-1 pl-3 pr-16 font-mono text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${radiusMap[local.radius ?? "md"]}`}
					placeholder={local.placeholder ?? "Enter secret…"}
					aria-label="Secret value"
					value={value()}
					disabled={local.disabled}
					autocomplete="off"
					spellcheck={false}
					onInput={handleInput}
				/>
				<span class="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-1.5">
					<Show when={local.revealable ?? true}>
						<button
							type="button"
							class={iconBtn}
							aria-label={revealed() ? "Hide secret" : "Reveal secret"}
							aria-pressed={revealed()}
							onClick={() => setRevealed((v) => !v)}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-3.5 w-3.5"
								aria-hidden="true"
							>
								{revealed() ? (
									<path
										d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								) : (
									<path
										d="m3 3 18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A16.6 16.6 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.4-1"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								)}
							</svg>
						</button>
					</Show>
					<Show when={local.showCopy ?? true}>
						<button
							type="button"
							class={iconBtn}
							aria-label={copied() ? "Copied" : "Copy secret"}
							disabled={!value()}
							onClick={copy}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-3.5 w-3.5"
								aria-hidden="true"
							>
								{copied() ? (
									<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" class="text-success" />
								) : (
									<>
										<rect x="9" y="9" width="12" height="12" rx="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</>
								)}
							</svg>
						</button>
					</Show>
				</span>
			</div>
			<Show when={(local.showStrength ?? true) && value()}>
				<div class="mt-1.5 flex items-center gap-1" aria-hidden="true">
					<For each={[0, 1, 2, 3]}>
						{(i) => <span class={`h-1 flex-1 rounded-full ${i < score() ? strength().cls : "bg-muted"}`} />}
					</For>
					<span class={`ml-1 font-mono text-2xs ${strength().text}`}>{strength().label}</span>
				</div>
				<span class="sr-only" role="status">
					{`Secret strength: ${strength().label}`}
				</span>
			</Show>
		</div>
	);
}
