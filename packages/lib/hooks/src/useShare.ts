import { type Accessor, createSignal } from "solid-js";

export interface ShareState {
	/** navigator.share support flag */
	supported: boolean;
	/** True after a successful share */
	shared: Accessor<boolean>;
	/** True while a share call is in flight */
	sharing: Accessor<boolean>;
	/** Share error message, if any */
	error: Accessor<string | undefined>;
	share: (data: ShareData) => Promise<void>;
	/** navigator.canShare check — `false` when unsupported */
	canShare: (data: ShareData) => boolean;
	/** Share files — runs `canShare` first and records the error when refused */
	shareFiles: (files: File[], data?: Omit<ShareData, "files">) => Promise<boolean>;
}

/**
 * Web Share API — `share({ title, text, url })` and `shareFiles(files)` with
 * `supported`/`shared`/`sharing` state plus a `canShare` preflight check.
 * Everything degrades to no-ops when `navigator.share` is missing.
 *
 * @returns `{ supported, shared, sharing, error, share, canShare, shareFiles }`
 *
 * @example
 * const share = useShare();
 * <button onClick={() => share.share({ title: "Hi", url: location.href })}>Share</button>
 */
export function useShare(): ShareState {
	const [shared, setShared] = createSignal(false);
	const [sharing, setSharing] = createSignal(false);
	const [error, setError] = createSignal<string>();
	const supported = typeof navigator !== "undefined" && "share" in navigator;

	const share = async (data: ShareData) => {
		if (!supported) {
			setError("share unsupported");
			return;
		}
		setSharing(true);
		try {
			await navigator.share(data);
			setShared(true);
			setError(undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : "share failed");
		} finally {
			setSharing(false);
		}
	};

	const canShare = (data: ShareData) =>
		supported && typeof navigator.canShare === "function" ? navigator.canShare(data) : false;

	const shareFiles = async (files: File[], data?: Omit<ShareData, "files">) => {
		const payload: ShareData = { ...data, files };
		if (!supported || !canShare(payload)) {
			setError("file share unsupported");
			return false;
		}
		await share(payload);
		return shared() && !error();
	};

	return { supported, shared, sharing, error, share, canShare, shareFiles };
}
