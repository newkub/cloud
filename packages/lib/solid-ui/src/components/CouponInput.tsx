/**
 * CouponInput — promo-code field with apply button and success/error feedback.
 */
import { createSignal, createUniqueId, type JSX, Show, splitProps } from "solid-js";

export interface CouponInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput"> {
	/** Validates the code — return (or resolve) `true` when the coupon applies. */
	onApply?: (code: string) => boolean | Promise<boolean>;
	/** Placeholder for the code field. @default "Enter coupon code" */
	placeholder?: string;
	/** Disable the field and button. @default false */
	disabled?: boolean;
}

export function CouponInput(props: CouponInputProps) {
	const [local, rest] = splitProps(props, ["class", "onApply", "placeholder", "disabled"]);
	const id = `solidui-coupon-input-${createUniqueId()}`;
	const [code, setCode] = createSignal("");
	const [status, setStatus] = createSignal<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = createSignal("");

	const apply = async () => {
		const value = code().trim();
		if (!value) {
			setStatus("error");
			setMessage("Enter a code first.");
			return;
		}
		setStatus("loading");
		setMessage("");
		try {
			const ok = (await local.onApply?.(value)) ?? true;
			setStatus(ok ? "success" : "error");
			setMessage(ok ? "Coupon applied." : "This code is invalid or expired.");
		} catch {
			setStatus("error");
			setMessage("Could not apply the code. Try again.");
		}
	};

	const statusIcon = () =>
		status() === "success" ? (
			<svg
				class="h-4 w-4 text-success"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		) : status() === "error" ? (
			<svg
				class="h-4 w-4 text-destructive"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="m15 9-6 6M9 9l6 6" stroke-linecap="round" />
			</svg>
		) : null;

	return (
		<div class={`solidui-coupon-input flex flex-col gap-1.5 ${local.class ?? ""}`} {...rest}>
			<label for={id} class="text-sm font-medium text-foreground">
				Coupon code
			</label>
			<div class="flex gap-2">
				<input
					id={id}
					type="text"
					class="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm uppercase tracking-wide text-foreground shadow-sm placeholder:normal-case placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					placeholder={local.placeholder ?? "Enter coupon code"}
					value={code()}
					disabled={local.disabled || status() === "loading"}
					onInput={(e) => {
						setCode(e.currentTarget.value);
						if (status() !== "idle") setStatus("idle");
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") apply();
					}}
				/>
				<button
					type="button"
					class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					onClick={apply}
					disabled={local.disabled || status() === "loading"}
				>
					{status() === "loading" ? "Applying…" : "Apply"}
				</button>
			</div>
			<Show when={status() === "success" || status() === "error"}>
				<p
					role={status() === "error" ? "alert" : "status"}
					class={`flex items-center gap-1.5 text-xs ${status() === "success" ? "text-success" : "text-destructive"}`}
				>
					{statusIcon()}
					{message()}
				</p>
			</Show>
		</div>
	);
}
