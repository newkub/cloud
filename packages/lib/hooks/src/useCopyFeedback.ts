import type { Accessor } from "solid-js";
import { useCopyToClipboard } from "./useCopyToClipboard";

export interface CopyFeedbackControls {
	/** Copy `text` — resolves true on success */
	copy: (text: string) => Promise<boolean>;
	/** True for `timeout` ms after a successful copy */
	copied: Accessor<boolean>;
}

/**
 * Copy-to-clipboard with transient "copied" feedback — composes
 * {@link useCopyToClipboard} so `copied()` flips true on success and
 * auto-resets after `timeout`. Ideal for "Copy" buttons that flash
 * "Copied!" before reverting.
 *
 * @param timeout — Milliseconds `copied()` stays true. @default 1600
 * @returns `{ copy, copied }`
 *
 * @example
 * const { copy, copied } = useCopyFeedback(1200);
 * <button onClick={() => copy(link)}>{copied() ? "Copied!" : "Copy link"}</button>
 */
export function useCopyFeedback(timeout = 1600): CopyFeedbackControls {
	const { copy, copied } = useCopyToClipboard({ copiedTimeout: timeout });
	return { copy, copied };
}
