/**
 * GiftCardInput — grouped gift-card code field (XXXX-XXXX-XXXX) with balance check and result line.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface GiftCardBalance {
	balance: number;
}

export interface GiftCardInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/** Balance lookup — may return a promise; thrown errors show as a failure line. */
	onCheck?: (code: string) => GiftCardBalance | Promise<GiftCardBalance>;
	/** ISO 4217 currency used to format the balance. @default "USD" */
	currency?: string;
	/** BCP 47 locale for balance formatting — defaults to the runtime locale. */
	locale?: string;
	/** Field label. @default "Gift card" */
	label?: string;
	/** Check button label. @default "Check balance" */
	checkLabel?: string;
	/** Corner radius on the field group. */
	radius?: Radius;
	disabled?: boolean;
}

/** Format raw input as groups of 4 uppercase alphanumerics joined by dashes. */
function groupCode(raw: string): string {
	const clean = raw
		.replace(/[^a-zA-Z0-9]/g, "")
		.toUpperCase()
		.slice(0, 12);
	return clean.replace(/(.{4})(?=.)/g, "$1-");
}

export function GiftCardInput(props: GiftCardInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"onCheck",
		"currency",
		"locale",
		"label",
		"checkLabel",
		"radius",
		"disabled",
	]);
	const [code, setCode] = createSignal("");
	const [checking, setChecking] = createSignal(false);
	const [result, setResult] = createSignal<{ balance: number } | { error: string } | null>(null);

	const complete = () => code().replace(/-/g, "").length === 12;
	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(n);

	const check = async () => {
		if (!local.onCheck || checking() || !complete()) return;
		setChecking(true);
		setResult(null);
		try {
			const res = await local.onCheck(code());
			setResult({ balance: res.balance });
		} catch (e) {
			setResult({ error: e instanceof Error ? e.message : "Could not check this card" });
		} finally {
			setChecking(false);
		}
	};

	return (
		<div class={`solidui-gift-card-input w-full max-w-xs ${local.class ?? ""}`.trim()} {...rest}>
			<label for="gift-card-code" class="mb-1.5 block text-xs font-medium text-foreground">
				{local.label ?? "Gift card"}
			</label>
			<div
				class={`flex items-stretch overflow-hidden border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring ${radiusMap[local.radius ?? "md"]}`}
			>
				<input
					id="gift-card-code"
					type="text"
					inputmode="text"
					autocomplete="off"
					spellcheck={false}
					placeholder="XXXX-XXXX-XXXX"
					aria-describedby="gift-card-result"
					aria-invalid={result() !== null && "error" in (result() ?? {}) ? true : undefined}
					disabled={local.disabled || checking()}
					class="h-9 min-w-0 flex-1 border-0 bg-transparent px-3 font-mono text-sm tracking-wider text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none disabled:opacity-50"
					value={code()}
					onInput={(e) => {
						setCode(groupCode(e.currentTarget.value));
						setResult(null);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							check();
						}
					}}
				/>
				<button
					type="button"
					disabled={local.disabled || checking() || !complete() || !local.onCheck}
					class="shrink-0 border-l border-input bg-muted/50 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onClick={check}
				>
					{checking() ? "Checking…" : (local.checkLabel ?? "Check balance")}
				</button>
			</div>
			<p id="gift-card-result" aria-live="polite" class="mt-1.5 min-h-4 text-xs">
				<Show when={result()}>
					{(r) => (
						<Show
							when={"balance" in r()}
							fallback={<span class="text-destructive">{(r() as { error: string }).error}</span>}
						>
							<span class="text-success">Balance: {fmt((r() as { balance: number }).balance)}</span>
						</Show>
					)}
				</Show>
			</p>
		</div>
	);
}
